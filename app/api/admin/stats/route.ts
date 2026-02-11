import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import Beat from '@/models/Beat';
import Order from '@/models/Order';
import User from '@/models/User';
import { getAdminFromRequest } from '@/lib/utils/adminAuth';

/**
 * GET /api/admin/stats
 * Récupère les statistiques globales de la plateforme
 */
export async function GET(request: NextRequest) {
  try {
    // Vérification admin
    getAdminFromRequest(request);

    await connectDB();

    // Date du début du mois en cours
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    // Date il y a 30 jours
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Statistiques parallèles
    const [
      totalBeats,
      activeBeats,
      totalOrders,
      completedOrders,
      totalRevenue,
      monthRevenue,
      totalUsers,
      topBeats,
      recentOrders,
      dailyRevenue,
    ] = await Promise.all([
      // Total beats
      Beat.countDocuments(),
      
      // Beats actifs
      Beat.countDocuments({ isActive: true }),
      
      // Total commandes
      Order.countDocuments(),
      
      // Commandes complétées
      Order.countDocuments({ status: 'completed' }),
      
      // Revenu total
      Order.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
      
      // Revenu du mois
      Order.aggregate([
        {
          $match: {
            status: 'completed',
            createdAt: { $gte: startOfMonth },
          },
        },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
      
      // Total utilisateurs
      User.countDocuments(),
      
      // Beats les plus vendus (top 5)
      Beat.find({ salesCount: { $gt: 0 } })
        .sort({ salesCount: -1 })
        .limit(5)
        .select('title coverImage salesCount')
        .lean(),
      
      // Dernières commandes (5)
      Order.find({ status: 'completed' })
        .populate('userId', 'email firstName lastName')
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
      
      // Revenu par jour (30 derniers jours)
      Order.aggregate([
        {
          $match: {
            status: 'completed',
            createdAt: { $gte: thirtyDaysAgo },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
            },
            revenue: { $sum: '$totalAmount' },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    // Formater les résultats
    const stats = {
      overview: {
        totalBeats,
        activeBeats,
        totalOrders,
        completedOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        monthRevenue: monthRevenue[0]?.total || 0,
        totalUsers,
      },
      topBeats,
      recentOrders,
      dailyRevenue: dailyRevenue.map((day) => ({
        date: day._id,
        revenue: day.revenue,
        orders: day.count,
      })),
    };

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error: any) {
    console.error('Admin stats GET error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch stats' },
      { status: error.message?.includes('Unauthorized') ? 401 : 500 }
    );
  }
}
