import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import Order from '@/models/Order';
import User from '@/models/User';
import { getAdminFromRequest } from '@/lib/utils/adminAuth';

/**
 * GET /api/admin/orders
 * Liste toutes les commandes avec pagination et filtres
 */
export async function GET(request: NextRequest) {
  try {
    // Vérification admin
    getAdminFromRequest(request);

    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    // Construire le filtre
    const filter: any = {};
    
    if (status && status !== 'all') {
      filter.status = status;
    }
    
    if (search) {
      filter.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { deliveryEmail: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate('userId', 'email firstName lastName')
        .populate('items.beatId', 'title coverImage')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Order.countDocuments(filter),
    ]);

    return NextResponse.json({
      success: true,
      data: orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Admin orders GET error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch orders' },
      { status: error.message?.includes('Unauthorized') ? 401 : 500 }
    );
  }
}
