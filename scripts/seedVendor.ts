import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  const user = await prisma.user.findFirst();
  if (!user) {
    console.error('No users found in DB. Create a user via Better Auth first.');
    process.exit(1);
  }

  // Create seller profile if missing
  let seller = await prisma.sellerProfile.findUnique({
    where: { userId: user.id },
  });
  if (!seller) {
    seller = await prisma.sellerProfile.create({
      data: {
        userId: user.id,
        displayName: user.name ?? user.email,
        slug: `seller-${user.id.slice(0, 8)}`,
      },
    });
    console.log('Created sellerProfile:', seller.id);
  } else {
    console.log('Found existing sellerProfile:', seller.id);
  }

  // Create vendor if missing
  let vendor = await prisma.vendor.findFirst({
    where: { sellerId: seller.id },
  });
  if (!vendor) {
    vendor = await prisma.vendor.create({
      data: {
        sellerId: seller.id,
        name: `${seller.displayName} Store`,
        slug: `vendor-${seller.id.slice(0, 8)}`,
      },
    });
    console.log('Created vendor:', vendor.id);
  } else {
    console.log('Found existing vendor:', vendor.id);
  }

  console.log('Seed complete');
  process.exit(0);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
