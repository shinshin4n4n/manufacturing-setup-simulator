import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DIRECT_URL,
});

async function main() {
  console.log('🌱 Starting seed...');

  // 既存データをクリア
  await prisma.setupMatrix.deleteMany();
  await prisma.equipment.deleteMany();
  console.log('✅ Cleared existing data');

  // 設備データを作成
  const equipmentData = [
    { code: 'A', name: 'プレス機', description: '金属加工' },
    { code: 'B', name: '旋盤', description: '切削加工' },
    { code: 'C', name: 'フライス盤', description: '精密加工' },
    { code: 'D', name: '研削盤', description: '仕上げ加工' },
    { code: 'E', name: '検査装置', description: '品質確認' },
  ];

  const createdEquipment = await Promise.all(
    equipmentData.map((equipment) =>
      prisma.equipment.create({
        data: equipment,
      })
    )
  );
  console.log(`✅ Created ${createdEquipment.length} equipment records`);

  // 段取り時間マトリックスデータ
  // [from][to] = 段取り時間（分）
  const setupTimeMatrix = [
    [0, 15, 30, 20, 25], // A -> A,B,C,D,E
    [20, 0, 10, 35, 15], // B -> A,B,C,D,E
    [25, 12, 0, 18, 22], // C -> A,B,C,D,E
    [18, 28, 20, 0, 14], // D -> A,B,C,D,E
    [22, 16, 24, 12, 0], // E -> A,B,C,D,E
  ];

  // 段取り時間マトリックスを作成
  const setupMatrixRecords = [];
  for (let i = 0; i < createdEquipment.length; i++) {
    for (let j = 0; j < createdEquipment.length; j++) {
      setupMatrixRecords.push({
        fromEquipmentId: createdEquipment[i].id,
        toEquipmentId: createdEquipment[j].id,
        setupTime: setupTimeMatrix[i][j],
      });
    }
  }

  const createdSetupMatrix = await prisma.setupMatrix.createMany({
    data: setupMatrixRecords,
  });
  console.log(`✅ Created ${createdSetupMatrix.count} setup matrix records`);

  // 作成されたデータを確認
  console.log('\n📊 Seeded data summary:');
  console.log('Equipment:');
  createdEquipment.forEach((eq) => {
    console.log(`  ${eq.code}: ${eq.name} (${eq.description})`);
  });

  console.log('\n段取り時間マトリックス（分）:');
  console.log('     ', createdEquipment.map((eq) => eq.code).join('   '));
  for (let i = 0; i < createdEquipment.length; i++) {
    const row = setupTimeMatrix[i].map((time) => time.toString().padStart(3, ' ')).join(' ');
    console.log(`${createdEquipment[i].code}    ${row}`);
  }

  console.log('\n✨ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
