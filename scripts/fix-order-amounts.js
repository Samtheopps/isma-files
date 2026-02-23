const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const uri = process.env.MONGODB_URI;

async function fixOrderAmounts() {
  if (!uri) {
    console.error('❌ MONGODB_URI non définie dans .env.local');
    process.exit(1);
  }

  console.log('🔗 Connexion à MongoDB...');
  const client = await MongoClient.connect(uri);
  const db = client.db();
  const orders = db.collection('orders');
  
  // Récupérer toutes les commandes
  const allOrders = await orders.find({}).toArray();
  
  console.log(`\n🔍 ${allOrders.length} commandes trouvées\n`);
  
  if (allOrders.length === 0) {
    console.log('✅ Aucune commande à corriger');
    await client.close();
    return;
  }
  
  // Afficher les modifications prévues
  console.log('📊 APERÇU DES MODIFICATIONS:\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  for (const order of allOrders) {
    console.log(`\n📦 Commande: ${order.orderNumber || order._id}`);
    console.log(`   Total actuel: ${order.totalAmount} → Nouveau: ${order.totalAmount * 100}`);
    
    if (order.items && order.items.length > 0) {
      console.log('   Items:');
      order.items.forEach((item, index) => {
        console.log(`     ${index + 1}. ${item.beatTitle || 'Sans titre'}`);
        console.log(`        Prix actuel: ${item.price} → Nouveau: ${item.price * 100}`);
      });
    }
  }
  
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  // Demander confirmation
  console.log('\n⚠️  ATTENTION: Ces modifications vont multiplier par 100 tous les montants');
  console.log('⏳ Appuyez sur Ctrl+C pour annuler, ou attendez 5 secondes pour continuer...\n');
  
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  console.log('🚀 Démarrage des corrections...\n');
  
  // Appliquer les corrections
  let fixed = 0;
  let errors = 0;
  
  for (const order of allOrders) {
    try {
      await orders.updateOne(
        { _id: order._id },
        {
          $set: {
            totalAmount: order.totalAmount * 100,
            items: order.items.map(item => ({
              ...item,
              price: item.price * 100
            }))
          }
        }
      );
      fixed++;
      console.log(`✅ Commande ${order.orderNumber || order._id} corrigée`);
    } catch (error) {
      errors++;
      console.error(`❌ Erreur sur commande ${order.orderNumber || order._id}:`, error.message);
    }
  }
  
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`\n✅ ${fixed} commandes corrigées avec succès`);
  
  if (errors > 0) {
    console.log(`⚠️  ${errors} erreurs rencontrées`);
  }
  
  console.log('\n🔌 Fermeture de la connexion MongoDB...');
  await client.close();
  console.log('✅ Terminé!\n');
}

// Exécuter le script
fixOrderAmounts()
  .catch(error => {
    console.error('\n❌ ERREUR FATALE:', error);
    process.exit(1);
  });
