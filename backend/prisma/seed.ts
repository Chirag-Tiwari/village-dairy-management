import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function hash(password: string) {
  return bcrypt.hash(password, 12);
}

async function main() {
  console.log('Seeding database...');

  const region = await prisma.region.create({
    data: { name: 'Aligarh Region' },
  });

  const supervisorUser = await prisma.user.create({
    data: {
      mobileNumber: '9000000001',
      passwordHash: await hash('password123'),
      role: 'SUPERVISOR',
    },
  });

  const supervisorStaff = await prisma.staff.create({
    data: {
      userId: supervisorUser.id,
      name: 'Anil Kumar',
      mobileNumber: '9000000001',
      role: 'SUPERVISOR',
    },
  });

  await prisma.region.update({
    where: { id: region.id },
    data: { supervisorId: supervisorStaff.id },
  });

  const secretaryUser = await prisma.user.create({
    data: {
      mobileNumber: '9000000002',
      passwordHash: await hash('password123'),
      role: 'SECRETARY',
    },
  });

  const secretaryStaff = await prisma.staff.create({
    data: {
      userId: secretaryUser.id,
      name: 'Suresh Pal',
      mobileNumber: '9000000002',
      role: 'SECRETARY',
    },
  });

  const dairy = await prisma.dairy.create({
    data: {
      name: 'Rampur Village Dairy',
      village: 'Rampur',
      regionId: region.id,
      secretaryId: secretaryStaff.id,
    },
  });

  const farmerSeeds = [
    { name: 'Ram Singh', mobileNumber: '9000000011', village: 'Rampur', category: 'GEN' as const },
    { name: 'Shyam Lal', mobileNumber: '9000000012', village: 'Rampur', category: 'SC' as const },
    { name: 'Geeta Devi', mobileNumber: '9000000013', village: 'Rampur', category: 'ST' as const },
  ];

  for (const f of farmerSeeds) {
    const user = await prisma.user.create({
      data: {
        mobileNumber: f.mobileNumber,
        passwordHash: await hash('password123'),
        role: 'USER',
      },
    });

    await prisma.farmer.create({
      data: {
        userId: user.id,
        name: f.name,
        mobileNumber: f.mobileNumber,
        village: f.village,
        category: f.category,
        dairyId: dairy.id,
      },
    });
  }

  console.log('Seed complete.');
  console.log('Supervisor login: 9000000001 / password123');
  console.log('Secretary login: 9000000002 / password123');
  console.log('Farmer logins: 9000000011, 9000000012, 9000000013 / password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
