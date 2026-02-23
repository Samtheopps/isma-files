const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const uri = process.env.MONGODB_URI;

async function fixItemPrices() {
  console.log('🔗 Connexion à MongoDB...\n');
  
  const client = await MongoClient.connect(uri);
  const db = client.db();
  const orders = db.collection('orders');
  
  // Récupérer toutes les commandes
  const allOrders = await orders.find({}).toArray();
  
  console.log(`🔍 ${allOrders.length} commandes trouvées\n`);
  console.log('📊 APERÇU DES CORRECTIONS:\n');
  console.log('━'.repeat(60));
  
  // Afficher les modifications prévues
  for (const order of allOrders) {
    console.log(`\n📦 Commande: ${order.orderNumber}`);
    console.log(`   Total: ${order.totalAmount} centimes (correct, pas de changement)`);
    console.log('   Items:');
    order.items.forEach((item, idx) => {
      const newPrice = Math.round(item.price / 100);
      console.log(`     ${idx + 1}. ${item.beatTitle}`);
      console.log(`        Prix actuel: ${item.price} → Nouveau: ${newPrice}`);
    });
  }
  
  console.log('\n' + '━'.repeat(60));
  console.log('\n⚠️  Ces modifications vont diviser par 100 les prix des items');
  console.log('⏳ Appuyez sur Ctrl+C pour annuler, ou attendez 5 secondes...\n');
  
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  console.log('🚀 Démarrage des corrections...\n');
  
  // Appliquer les corrections
  let fixed = 0;
  for (const order of allOrders) {
    const updatedItems = order.items.map(item => ({
      ...item,
      price: Math.round(item.price / 100)
    }));
    
    await orders.updateOne(
      { _id: order._id },
      { $set: { items: updatedItems } }
    );
    
    console.log(`✅ Commande ${order.orderNumber} corrigée`);
    fixed++;
  }
  
  console.log('\n' + '━'.repeat(60));
  console.log(`\n✅ ${fixed} commandes corrigées avec succès\n`);
  
  await client.close();
  console.log('🔌 Fermeture de la connexion MongoDB...');
  console.log('✅ Terminé!');
}

fixItemPrices().catch(err => {
  console.error('❌ Erreur:', err);
  process.exit(1);
});
