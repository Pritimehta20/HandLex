import bcrypt from 'bcryptjs';
import userModel from './models/userModel.js';
import dbconnect from './config/dbconnect.js';
import dotenv from 'dotenv';

dotenv.config();

const createAdmin = async () => {
  try {
    console.log('🔄 Connecting to database...');
    await dbconnect();
    console.log('✅ Database connected');

    const adminEmail = process.argv[2] || 'kuku@gmail.com';
    const adminPassword = process.argv[3] || 'kuku1234';
    const adminName = process.argv[4] || 'kukuadmin';

    console.log(`\n📝 Creating admin user:`);
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Name: ${adminName}`);

    // Check if admin already exists
    const existingAdmin = await userModel.findOne({ email: adminEmail });
    if (existingAdmin) {
      if (existingAdmin.isAdmin) {
        console.log(`\n❌ Admin with email "${adminEmail}" already exists!`);
      } else {
        console.log(`\n⚠️ User with email "${adminEmail}" exists but is not an admin.`);
        console.log(`   Converting to admin...`);
        existingAdmin.isAdmin = true;
        await existingAdmin.save();
        console.log(`✅ User promoted to admin successfully!`);
      }
      process.exit(0);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(adminPassword, salt);

    // Create admin
    const newAdmin = new userModel({
      name: adminName,
      email: adminEmail,
      passwordHash,
      isAdmin: true,
      status: 'Active',
      preferredLanguage: 'en'
    });

    const saved = await newAdmin.save();

    console.log('\n✅ Admin user created successfully!');
    console.log(`\n📋 Admin Credentials:`);
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);
    console.log(`   Name: ${adminName}`);
    console.log(`\n🔐 Login at: http://localhost:5173/admin/login`);
    console.log(`\n⚠️ IMPORTANT: Change the password after first login!`);

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error creating admin:', error.message);
    process.exit(1);
  }
};

createAdmin();
