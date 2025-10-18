import { NextRequest, NextResponse } from 'next/server';
import { getSafeAdminProducts } from '@/lib/firebase/safe-firestore';
import { isDataResult } from '@/types/safe';

export async function GET(request: NextRequest) {
  try {
    const result = await getSafeAdminProducts();

    if (isDataResult(result)) {
      return NextResponse.json({
        success: true,
        data: result.data,
        error: result.error,
      });
    } else {
      return NextResponse.json({
        success: false,
        data: [],
        error: result?.error || 'Failed to fetch products',
      });
    }
  } catch (error) {
    console.error('Admin products API error:', error);
    return NextResponse.json(
      {
        success: false,
        data: [],
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
