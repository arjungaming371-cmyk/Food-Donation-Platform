// Seed script for FoodBridge HACK-P197
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data cleanly in reverse order of relationships
  await prisma.adminAuditLog.deleteMany();
  await prisma.report.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.donationStatusHistory.deleteMany();
  await prisma.donationRequest.deleteMany();
  await prisma.foodListing.deleteMany();
  await prisma.organizationProfile.deleteMany();
  await prisma.donorProfile.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('demo123', 10);
  const adminPasswordHash = await bcrypt.hash('admin123', 10);

  // 1. Create Admin
  const admin = await prisma.user.create({
    data: {
      email: 'admin@foodbridge.org',
      password: adminPasswordHash,
      name: 'System Admin (FoodBridge)',
      role: 'ADMIN',
      phone: '+91 98480 00111',
      address: 'HITEC City, Madhapur',
      city: 'Hyderabad',
      latitude: 17.4435,
      longitude: 78.3772,
    },
  });

  // 2. Create Donors
  const donorsData = [
    {
      email: 'donor1@foodbridge.org',
      name: 'Paradise Biryani Restaurant',
      businessName: 'Paradise Food Court',
      businessType: 'Restaurant',
      fssaiNumber: '13618011000234',
      phone: '+91 98480 11001',
      address: 'MG Road, Secunderabad',
      city: 'Hyderabad',
      lat: 17.4399,
      lng: 78.4983,
      pickupInstructions: 'Report to rear kitchen service counter. Bring clean food-grade transport containers.',
    },
    {
      email: 'donor2@foodbridge.org',
      name: 'Bawarchi Caterers & Kitchen',
      businessName: 'Bawarchi Catering Services',
      businessType: 'Caterer',
      fssaiNumber: '13619012000567',
      phone: '+91 98480 11002',
      address: 'RTC X Roads, Chikkadpally',
      city: 'Hyderabad',
      lat: 17.4042,
      lng: 78.4983,
      pickupInstructions: 'Enter through side gate #2. Loading dock available for small vans/autos.',
    },
    {
      email: 'donor3@foodbridge.org',
      name: 'Green Leaf Organic Grocers',
      businessName: 'Green Leaf Retail & Fresh Produce',
      businessType: 'Grocery',
      fssaiNumber: '13620013000890',
      phone: '+91 98480 11003',
      address: 'Road No 12, Banjara Hills',
      city: 'Hyderabad',
      lat: 17.4156,
      lng: 78.4354,
      pickupInstructions: 'Collect from fresh goods storage dispatch bay. Staff will assist loading.',
    },
    {
      email: 'donor4@foodbridge.org',
      name: 'Taj Krishna Banquets & Dining',
      businessName: 'Taj Banquets Kitchen',
      businessType: 'Hotel',
      fssaiNumber: '13615014000321',
      phone: '+91 98480 11004',
      address: 'Road No 1, Banjara Hills',
      city: 'Hyderabad',
      lat: 17.4168,
      lng: 78.4487,
      pickupInstructions: 'Security check at Gate 3. Thermally insulated boxes ready for pickup.',
    },
    {
      email: 'donor5@foodbridge.org',
      name: 'Minerva Grand Bakery & Meals',
      businessName: 'Minerva Foods Ltd',
      businessType: 'Community Kitchen',
      fssaiNumber: '13617015000789',
      phone: '+91 98480 11005',
      address: 'SD Road, Secunderabad',
      city: 'Hyderabad',
      lat: 17.4411,
      lng: 78.5011,
      pickupInstructions: 'Front cashier will direct to bakery dispatch counter.',
    },
  ];

  const donors = [];
  for (const d of donorsData) {
    const user = await prisma.user.create({
      data: {
        email: d.email,
        password: passwordHash,
        name: d.name,
        role: 'DONOR',
        phone: d.phone,
        address: d.address,
        city: d.city,
        latitude: d.lat,
        longitude: d.lng,
        donorProfile: {
          create: {
            businessName: d.businessName,
            businessType: d.businessType,
            fssaiNumber: d.fssaiNumber,
            operatingHours: '9:00 AM - 11:00 PM',
            pickupInstructions: d.pickupInstructions,
            verified: true,
            safetyPledgeAccepted: true,
          },
        },
      },
    });
    donors.push(user);
  }

  // 3. Create Recipient Organizations (NGOs)
  const recipientsData = [
    {
      email: 'hope@ngo.org',
      name: 'Hope Community Foundation',
      orgName: 'Hope Community Foundation',
      orgType: 'NGO',
      regNumber: 'HYD/NGO/2018/8892',
      phone: '+91 98480 22001',
      address: 'Near Gandhi Hospital, Musheerabad',
      city: 'Hyderabad',
      lat: 17.4239,
      lng: 78.5034,
      peopleServed: 250,
      serviceArea: 'Central Hyderabad & Musheerabad',
      beneficiaryDescription: 'Distributes hot meals to families of hospital patients and shelter residents.',
    },
    {
      email: 'helpinghands@ngo.org',
      name: 'Helping Hands Humanity',
      orgName: 'Helping Hands Humanity NGO',
      orgType: 'Charitable Organization',
      regNumber: 'TS/CHARITY/2020/4102',
      phone: '+91 98480 22002',
      address: 'Mehdipatnam Main Road',
      city: 'Hyderabad',
      lat: 17.3916,
      lng: 78.4398,
      peopleServed: 180,
      serviceArea: 'Mehdipatnam, Tolichowki & Asif Nagar',
      beneficiaryDescription: 'Operates night shelters and evening meal distribution programs for day-laborers.',
    },
    {
      email: 'annapurna@ngo.org',
      name: 'Annapurna Food Support Center',
      orgName: 'Annapurna Relief & Support Center',
      orgType: 'Community Group',
      regNumber: 'HYD/SOC/2016/1129',
      phone: '+91 98480 22003',
      address: 'Ameerpet Cross Roads',
      city: 'Hyderabad',
      lat: 17.4375,
      lng: 78.4482,
      peopleServed: 320,
      serviceArea: 'Ameerpet, Sanath Nagar & SR Nagar',
      beneficiaryDescription: 'Runs food kitchens serving senior citizens living alone and underprivileged students.',
    },
  ];

  const recipients = [];
  for (const r of recipientsData) {
    const user = await prisma.user.create({
      data: {
        email: r.email,
        password: passwordHash,
        name: r.name,
        role: 'RECIPIENT',
        phone: r.phone,
        address: r.address,
        city: r.city,
        latitude: r.lat,
        longitude: r.lng,
        orgProfile: {
          create: {
            orgName: r.orgName,
            orgType: r.orgType,
            registrationNumber: r.regNumber,
            estimatedPeopleServed: r.peopleServed,
            serviceArea: r.serviceArea,
            beneficiaryDescription: r.beneficiaryDescription,
            verified: true,
          },
        },
      },
    });
    recipients.push(user);
  }

  // 4. Create Food Listings (At least 10 realistic listings)
  const now = new Date();
  const listingsData = [
    {
      donorIndex: 0,
      title: 'Vegetable Biryani with Mirchi Ka Salan',
      description: 'Freshly prepared dum vegetable biryani with aromatic basmati rice, vegetables, paneer, and accompanied with sealed salan packets.',
      category: 'Cooked Meals',
      imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=60',
      totalQuantity: 20,
      availableQuantity: 15,
      unit: 'kg',
      dietaryType: 'VEG',
      allergens: 'Dairy (Ghee & Paneer)',
      storageCondition: 'Hot / Insulated',
      handlingInstructions: 'Stored in insulated thermal food containers at 65°C. Consume or redistribute within 4 hours of pickup.',
      pickupAddress: 'Paradise Food Court, MG Road, Secunderabad',
      lat: 17.4399,
      lng: 78.4983,
      hoursAgoPrepared: 1.5,
      hoursUntilExpiry: 3.5,
    },
    {
      donorIndex: 0,
      title: 'Steamed South Indian Idlis (100 pcs)',
      description: 'Hot steamed idlis prepared for breakfast buffet, untouched in warmers. Comes with dry podi packets.',
      category: 'Cooked Meals',
      imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=60',
      totalQuantity: 100,
      availableQuantity: 100,
      unit: 'pieces',
      dietaryType: 'VEG',
      allergens: 'None',
      storageCondition: 'Hot / Insulated',
      handlingInstructions: 'Packed in clean steam trays. Keep warm or reheat thoroughly prior to serving.',
      pickupAddress: 'Paradise Food Court, MG Road, Secunderabad',
      lat: 17.4399,
      lng: 78.4983,
      hoursAgoPrepared: 2,
      hoursUntilExpiry: 4,
    },
    {
      donorIndex: 1,
      title: 'Fresh Wheat Chapatis (80 pcs)',
      description: 'Soft whole-wheat rotis cooked fresh for afternoon catering. Foil wrapped in stacks of 10.',
      category: 'Cooked Meals',
      imageUrl: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&auto=format&fit=crop&q=60',
      totalQuantity: 80,
      availableQuantity: 80,
      unit: 'pieces',
      dietaryType: 'VEG',
      allergens: 'Gluten (Wheat)',
      storageCondition: 'Room Temperature',
      handlingInstructions: 'Packed in food-grade aluminum foil. Store in dry containers away from sunlight.',
      pickupAddress: 'RTC X Roads, Chikkadpally, Hyderabad',
      lat: 17.4042,
      lng: 78.4983,
      hoursAgoPrepared: 1,
      hoursUntilExpiry: 6,
    },
    {
      donorIndex: 1,
      title: 'Mixed Vegetable Curry & Gravy',
      description: 'Rich tomato and onion based mild mixed vegetable curry cooked for lunch service.',
      category: 'Cooked Meals',
      imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=60',
      totalQuantity: 12,
      availableQuantity: 12,
      unit: 'kg',
      dietaryType: 'VEG',
      allergens: 'None',
      storageCondition: 'Hot / Insulated',
      handlingInstructions: 'Keep covered in stainless steel vessels at minimum 60°C.',
      pickupAddress: 'RTC X Roads, Chikkadpally, Hyderabad',
      lat: 17.4042,
      lng: 78.4983,
      hoursAgoPrepared: 2,
      hoursUntilExpiry: 3,
    },
    {
      donorIndex: 2,
      title: 'Fresh Seasonal Fruits Assortment',
      description: 'Fresh apples, bananas, sweet limes and pomegranates. Sorted and packed in clean crates.',
      category: 'Fruits & Vegetables',
      imageUrl: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=800&auto=format&fit=crop&q=60',
      totalQuantity: 12,
      availableQuantity: 12,
      unit: 'kg',
      dietaryType: 'VEGAN',
      allergens: 'None',
      storageCondition: 'Room Temperature',
      handlingInstructions: 'Keep in ventilated, cool crates. Wash thoroughly prior to eating.',
      pickupAddress: 'Road No 12, Banjara Hills, Hyderabad',
      lat: 17.4156,
      lng: 78.4354,
      hoursAgoPrepared: 4,
      hoursUntilExpiry: 24,
    },
    {
      donorIndex: 2,
      title: 'Whole Wheat & Multigrain Bread Packets',
      description: 'Fresh sliced bread packets from local bakery surplus, manufactured today with 3 days shelf life remaining.',
      category: 'Bakery & Bread',
      imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=60',
      totalQuantity: 40,
      availableQuantity: 40,
      unit: 'packets',
      dietaryType: 'VEG',
      allergens: 'Gluten (Wheat)',
      storageCondition: 'Room Temperature',
      handlingInstructions: 'Factory sealed packets. Store in cool and dry place away from pests.',
      pickupAddress: 'Road No 12, Banjara Hills, Hyderabad',
      lat: 17.4156,
      lng: 78.4354,
      hoursAgoPrepared: 6,
      hoursUntilExpiry: 48,
    },
    {
      donorIndex: 3,
      title: 'Tadka Dal & Steamed Sona Masoori Rice',
      description: 'Home-style yellow toor dal tempered with cumin, mustard, curry leaves and steamed white rice.',
      category: 'Cooked Meals',
      imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=60',
      totalQuantity: 10,
      availableQuantity: 10,
      unit: 'kg',
      dietaryType: 'VEG',
      allergens: 'Mustard seeds',
      storageCondition: 'Hot / Insulated',
      handlingInstructions: 'Transport in closed containers. Maintain above 60°C.',
      pickupAddress: 'Taj Krishna Banquets, Road No 1, Banjara Hills',
      lat: 17.4168,
      lng: 78.4487,
      hoursAgoPrepared: 1.5,
      hoursUntilExpiry: 4,
    },
    {
      donorIndex: 3,
      title: 'Fragrant South Indian Lemon Rice',
      description: 'Tangy lemon rice tempered with peanuts, green chillies, turmeric and roasted lentils.',
      category: 'Cooked Meals',
      imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&auto=format&fit=crop&q=60',
      totalQuantity: 8,
      availableQuantity: 8,
      unit: 'kg',
      dietaryType: 'VEGAN',
      allergens: 'Peanuts',
      storageCondition: 'Room Temperature',
      handlingInstructions: 'Hygienically packed in catering foil trays. Ready to serve.',
      pickupAddress: 'Taj Krishna Banquets, Road No 1, Banjara Hills',
      lat: 17.4168,
      lng: 78.4487,
      hoursAgoPrepared: 2,
      hoursUntilExpiry: 5,
    },
    {
      donorIndex: 4,
      title: 'Traditional Hyderabad Curd Rice with Pomegranate',
      description: 'Cooling curd rice with mustard tempering, grated ginger, curry leaves, and fresh pomegranate arils.',
      category: 'Cooked Meals',
      imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=60',
      totalQuantity: 10,
      availableQuantity: 10,
      unit: 'kg',
      dietaryType: 'VEG',
      allergens: 'Dairy (Yogurt/Milk)',
      storageCondition: 'Refrigerated',
      handlingInstructions: 'Store chilled between 2°C - 5°C. Do not leave exposed to ambient summer heat.',
      pickupAddress: 'Minerva Grand, SD Road, Secunderabad',
      lat: 17.4411,
      lng: 78.5011,
      hoursAgoPrepared: 1,
      hoursUntilExpiry: 4,
    },
    {
      donorIndex: 4,
      title: 'Assorted Bakery Puff Pastries & Buns',
      description: 'Fresh vegetable puffs and sweet buns baked this morning. Crisp and individually packaged.',
      category: 'Bakery & Bread',
      imageUrl: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=800&auto=format&fit=crop&q=60',
      totalQuantity: 50,
      availableQuantity: 50,
      unit: 'pieces',
      dietaryType: 'VEG',
      allergens: 'Gluten (Wheat), Dairy',
      storageCondition: 'Room Temperature',
      handlingInstructions: 'Packed in brown food-grade bags. Keep dry and away from humidity.',
      pickupAddress: 'Minerva Grand, SD Road, Secunderabad',
      lat: 17.4411,
      lng: 78.5011,
      hoursAgoPrepared: 3,
      hoursUntilExpiry: 18,
    },
  ];

  const createdListings = [];
  for (const item of listingsData) {
    const donor = donors[item.donorIndex];
    const prepTime = new Date(now.getTime() - item.hoursAgoPrepared * 60 * 60 * 1000);
    const expiryTime = new Date(now.getTime() + item.hoursUntilExpiry * 60 * 60 * 1000);
    const pickupStart = new Date(now.getTime() + 15 * 60 * 1000); // 15 mins from now
    const pickupEnd = expiryTime;

    const listing = await prisma.foodListing.create({
      data: {
        donorId: donor.id,
        title: item.title,
        description: item.description,
        category: item.category,
        imageUrl: item.imageUrl,
        totalQuantity: item.totalQuantity,
        availableQuantity: item.availableQuantity,
        unit: item.unit,
        dietaryType: item.dietaryType,
        allergens: item.allergens,
        cookedOrPreparedAt: prepTime,
        expiryOrBestBefore: expiryTime,
        storageCondition: item.storageCondition,
        handlingInstructions: item.handlingInstructions,
        donorDeclarationConfirmed: true,
        pickupAddress: item.pickupAddress,
        pickupCity: 'Hyderabad',
        latitude: item.lat,
        longitude: item.lng,
        pickupStartTime: pickupStart,
        pickupEndTime: pickupEnd,
        status: 'AVAILABLE',
      },
    });

    createdListings.push(listing);

    // Add status history
    await prisma.donationStatusHistory.create({
      data: {
        listingId: listing.id,
        actorId: donor.id,
        actorRole: 'DONOR',
        previousStatus: null,
        newStatus: 'AVAILABLE',
        note: 'Listing created by donor with certified safety declaration.',
        createdAt: prepTime,
      },
    });
  }

  // 5. Create realistic Requests in various states
  // Request 1: ACCEPTED request on first listing (Biryani, 5 kg reserved out of 20 kg, leaves 15 kg available)
  const acceptedRequest = await prisma.donationRequest.create({
    data: {
      listingId: createdListings[0].id,
      recipientId: recipients[0].id, // Hope Community
      requestedQuantity: 5,
      status: 'ACCEPTED',
      pickupVerificationCode: '849201',
      donorConfirmedHandover: false,
      recipientConfirmedPickup: false,
      notes: 'Our transport van will arrive at 3:30 PM with insulated food carriers.',
      createdAt: new Date(now.getTime() - 40 * 60 * 1000),
    },
  });

  await prisma.donationStatusHistory.create({
    data: {
      listingId: createdListings[0].id,
      requestId: acceptedRequest.id,
      actorId: recipients[0].id,
      actorRole: 'RECIPIENT',
      previousStatus: null,
      newStatus: 'PENDING',
      note: 'Requested 5 kg of Vegetable Biryani.',
      createdAt: new Date(now.getTime() - 40 * 60 * 1000),
    },
  });

  await prisma.donationStatusHistory.create({
    data: {
      listingId: createdListings[0].id,
      requestId: acceptedRequest.id,
      actorId: donors[0].id,
      actorRole: 'DONOR',
      previousStatus: 'PENDING',
      newStatus: 'ACCEPTED',
      note: 'Donor accepted request. Generated QR pickup verification PIN: 849201.',
      createdAt: new Date(now.getTime() - 25 * 60 * 1000),
    },
  });

  // Request 2: COMPLETED request from yesterday (Idlis donation)
  const completedRequest = await prisma.donationRequest.create({
    data: {
      listingId: createdListings[1].id,
      recipientId: recipients[1].id, // Helping Hands
      requestedQuantity: 50,
      status: 'COMPLETED',
      pickupVerificationCode: '492104',
      donorConfirmedHandover: true,
      recipientConfirmedPickup: true,
      donorHandoverAt: new Date(now.getTime() - 24 * 60 * 60 * 1000),
      recipientPickupAt: new Date(now.getTime() - 24 * 60 * 60 * 1000),
      notes: 'Successfully distributed to night shelter beneficiaries.',
      createdAt: new Date(now.getTime() - 26 * 60 * 60 * 1000),
    },
  });

  await prisma.donationStatusHistory.create({
    data: {
      listingId: createdListings[1].id,
      requestId: completedRequest.id,
      actorId: donors[0].id,
      actorRole: 'DONOR',
      previousStatus: 'ACCEPTED',
      newStatus: 'COMPLETED',
      note: 'Both parties verified pickup via code 492104. Handover verified.',
      createdAt: new Date(now.getTime() - 24 * 60 * 60 * 1000),
    },
  });

  // Request 3: PENDING request on Chapatis
  const pendingRequest = await prisma.donationRequest.create({
    data: {
      listingId: createdListings[2].id,
      recipientId: recipients[2].id, // Annapurna
      requestedQuantity: 40,
      status: 'PENDING',
      pickupVerificationCode: '109382',
      notes: 'Can pick up within 45 minutes.',
      createdAt: new Date(now.getTime() - 10 * 60 * 1000),
    },
  });

  await prisma.donationStatusHistory.create({
    data: {
      listingId: createdListings[2].id,
      requestId: pendingRequest.id,
      actorId: recipients[2].id,
      actorRole: 'RECIPIENT',
      previousStatus: null,
      newStatus: 'PENDING',
      note: 'Submitted request for 40 pieces.',
      createdAt: new Date(now.getTime() - 10 * 60 * 1000),
    },
  });

  // 6. Create in-app notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: donors[0].id,
        title: 'New Donation Request',
        message: 'Hope Community Foundation requested 5 kg of Vegetable Biryani.',
        type: 'REQUEST_RECEIVED',
        link: '/donor/requests',
        createdAt: new Date(now.getTime() - 40 * 60 * 1000),
      },
      {
        userId: recipients[0].id,
        title: 'Request Accepted!',
        message: 'Paradise Biryani accepted your request. Pickup PIN is 849201.',
        type: 'REQUEST_ACCEPTED',
        link: '/recipient/requests',
        createdAt: new Date(now.getTime() - 25 * 60 * 1000),
      },
      {
        userId: donors[1].id,
        title: 'Pending Request Awaiting Decision',
        message: 'Annapurna Food Support Center requested 40 pieces of Fresh Chapatis.',
        type: 'REQUEST_RECEIVED',
        link: '/donor/requests',
        createdAt: new Date(now.getTime() - 10 * 60 * 1000),
      },
      {
        userId: admin.id,
        title: 'Listing Report Submitted',
        message: 'A recipient flagged a potential labeling issue for investigation.',
        type: 'REPORT_ALERT',
        link: '/admin/reports',
        createdAt: new Date(now.getTime() - 5 * 60 * 1000),
      },
    ],
  });

  // 7. Create a Sample Report for Admin Moderation
  await prisma.report.create({
    data: {
      reporterId: recipients[0].id,
      listingId: createdListings[8].id, // Minerva curd rice
      reason: 'Incorrect food information',
      details: 'Please double-check listed allergen tag; curd contains dairy products.',
      status: 'PENDING',
      createdAt: new Date(now.getTime() - 15 * 60 * 1000),
    },
  });

  // 8. Admin Audit Log
  await prisma.adminAuditLog.create({
    data: {
      adminId: admin.id,
      action: 'SYSTEM_UPDATE',
      targetType: 'SYSTEM',
      targetId: 'seed-initialization',
      details: 'Platform initialized with verified donor and NGO organizations.',
      createdAt: new Date(now.getTime() - 60 * 60 * 1000),
    },
  });

  console.log('✅ Seed completed successfully!');
  console.log(`Created: 1 Admin, ${donors.length} Donors, ${recipients.length} Recipients, ${createdListings.length} Food Listings.`);
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
