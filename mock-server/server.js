const jsonServer  = require('json-server');
const server      = jsonServer.create();
const router      = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

// Initialize collections if missing
const db = router.db;
if (!db.has('otps').value()) {
  db.set('otps', []).write();
}
if (!db.has('users').value()) {
  db.set('users', []).write();
}
if (!db.has('categories').value()) {
  // Initialize with sample category data
  db.set('categories', [
    {
      _id: "cat1",
      slug: "surgical-items",
      name: "Surgical & Medical",
      color: "#4E9FDC",
      image: "surgical.png",
      createdAt: Date.now()
    },
    {
      _id: "cat2",
      slug: "medicines",
      name: "Medicines",
      color: "#E74C3C",
      image: "medicine.png",
      createdAt: Date.now()
    },
    {
      _id: "cat3",
      slug: "household-hygiene",
      name: "Home & Hygiene",
      color: "#27AE60",
      image: "household.png",
      createdAt: Date.now()
    },
    {
      _id: "cat4",
      slug: "wellness",
      name: "Wellness & Health",
      color: "#F39C12",
      image: "wellness.jpg",
      createdAt: Date.now()
    }
  ]).write();
}

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Utility: generate 6-digit OTP
function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * POST /api/auth/otp/send
 * Expects { phone }
 * Returns { success: true }
 */
server.post('/api/auth/otp/send', (req, res) => {
  const { phone } = req.body;
  if (!phone) {
    return res.status(400).json({ error: 'Phone number is required' });
  }
  const otp = generateOtp();
  // Store OTP in db.json
  db.get('otps')
    .remove({ phone }) // remove any existing
    .write();
  db.get('otps')
    .push({ phone, otp, createdAt: Date.now() })
    .write();
  // TODO: integrate SMS provider here
  console.log(`Sent OTP ${otp} to phone ${phone}`);
  res.json({ success: true });
});

/**
 * POST /api/auth/otp/verify
 * Expects { phone, otp }
 * Returns { user, token } or 401
 */
server.post('/api/auth/otp/verify', (req, res) => {
  const { phone, otp } = req.body;
  const record = db.get('otps').find({ phone, otp }).value();
  if (!record) {
    return res.status(401).json({ error: 'Invalid OTP' });
  }
  // OTP valid: remove it
  db.get('otps').remove({ phone, otp }).write();

  // Find or create user by phone
  let user = db.get('users').find({ phone }).value();
  if (!user) {
    user = { _id: Date.now().toString(), phone, createdAt: Date.now(), verificationStatus: 'unverified' };
    db.get('users').push(user).write();
  }
  const { password, ...userSafe } = user;
  // Issue fake token
  const token = `fake-jwt-token-${user._id}`;
  res.json({ user: userSafe, token });
});

/**
 * GET /api/user/me
 * Returns current user based on token header
 */
server.get('/api/user/me', (req, res) => {
  const auth = req.headers.authorization || '';
  const match = auth.match(/fake-jwt-token-(\d+)/);
  console.log('auth', auth);
  if (!match) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  const userId = match[1];
  const user = db.get('users').find({ _id: userId }).value();
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  const { password, ...userSafe } = user;

  console.log('userSafe', userSafe);
  res.json(userSafe);
});

/**
 * POST /api/user/verify
 * Expects verification data (e.g. name, idProof, etc.)
 * Returns updated user
 */
server.post('/api/user/verify', (req, res) => {
  const auth = req.headers.authorization || '';
  const match = auth.match(/fake-jwt-token-(\d+)/);
  if (!match) return res.status(401).json({ error: 'Not authenticated' });
  const userId = match[1];
  const updates = { verificationStatus: 'pending', verificationData: req.body };
  const updated = db.get('users').find({ _id: userId }).assign(updates).write();
  const { password, ...userSafe } = updated;
  res.json(userSafe);
});

/**
 * PATCH /api/user/update
 * Expects { _id, ...updates }
 * Returns updated user
 */
server.patch('/api/user/update', (req, res) => {
  const { _id, ...updates } = req.body;
  const updated = db.get('users').find({ _id }).assign(updates).write();
  if (!updated) {
    return res.status(404).json({ error: 'User not found' });
  }
  const { password, ...userSafe } = updated;
  res.json(userSafe);
});

/**
 * GET /api/admin/pending-verifications
 * Returns all users with verificationStatus === 'pending'
 */
server.get('/api/admin/pending-verifications', (req, res) => {
  const pending = db.get('users').filter({ verificationStatus: 'pending' }).value();
  res.json({ data: pending });
});

/**
 * PATCH /api/admin/approve/:userId
 * Expects { status } where status is 'approved' or 'rejected'
 * Returns updated user
 */
server.patch('/api/admin/approve/:userId', (req, res) => {
  const { userId } = req.params;
  const { status } = req.body;
  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }
  const updated = db.get('users').find({ _id: userId }).assign({ verificationStatus: status }).write();
  if (!updated) {
    return res.status(404).json({ error: 'User not found' });
  }
  const { password, ...userSafe } = updated;
  res.json(userSafe);
});

/**
 * GET /api/user?page=<n>
 * Pagination
 */
server.get('/api/user', (req, res) => {
  const page  = parseInt(req.query.page) || 1;
  const limit = 10;
  const all   = db.get('users').value();
  const start = (page - 1) * limit;
  const paged = all.slice(start, start + limit);
  res.json({ data: { users: paged, page } });
});

/**
 * DELETE /api/user/:id
 */
server.delete('/api/user/:id', (req, res) => {
  const id = req.params.id;
  db.get('users').remove({ _id: id }).write();
  res.status(204).end();
});



/**
 * GET /api/category
 * Returns all categories
 */
server.get('/api/category', (req, res) => {
  const categories = db.get('categories').value();
  res.json({ data: { categories } });
});

/**
 * GET /api/category/:id
 * Returns a single category by ID
 */
server.get('/api/category/:id', (req, res) => {
  const { id } = req.params;
  const category = db.get('categories').find({ _id: id }).value();
  
  if (!category) {
    return res.status(404).json({ error: 'Category not found' });
  }
  
  res.json({ data: category });
});

/**
 * PUT /api/category/:id
 * Updates a category
 * Expects body with category data
 */
server.put('/api/category/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  
  // Check if category exists
  const category = db.get('categories').find({ _id: id }).value();
  if (!category) {
    return res.status(404).json({ error: 'Category not found' });
  }
  
  // Update the category
  const updated = db.get('categories')
    .find({ _id: id })
    .assign({ ...updates, updatedAt: Date.now() })
    .write();
    
  res.json({ data: updated });
});

/**
 * POST /api/category
 * Creates a new category
 * Expects body with category data
 */
server.post('/api/category', (req, res) => {
  const newCategory = req.body;
  
  // Generate ID if not provided
  if (!newCategory._id) {
    newCategory._id = `cat${Date.now()}`;
  }
  
  // Add timestamps
  newCategory.createdAt = Date.now();
  
  // Add to database
  db.get('categories')
    .push(newCategory)
    .write();
    
  res.status(201).json({ data: newCategory });
});

// Custom API endpoint for feed data
server.get('/api/feed', (req, res) => {
  const db = router.db; // Get the lowdb instance
  const data = {
    categories: db.get('categories').value(),
    new_arrivals_medicine: db.get('products.new_arrivals_medicine').value(),
    new_arrivals_surgical: db.get('products.new_arrivals_surgical').value(),
    top_selling_medicine: db.get('products.top_selling_medicine').value(),
    top_selling_surgical: db.get('products.top_selling_surgical').value(),
  };
  
  res.json({ data: data });
});


// Fallback to default router
// server.use(router);

server.listen(3000, '0.0.0.0' ,() => {
  console.log('JSON-Server running on http://0.0.0.0:3000');
});
