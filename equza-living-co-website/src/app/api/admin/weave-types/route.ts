import { NextRequest, NextResponse } from 'next/server';
import { getSafeWeaveTypes } from '@/lib/firebase/safe-firestore';
import { isDataResult } from '@/types/safe';

export async function GET(request: NextRequest) {
  try {
    const result = await getSafeWeaveTypes();
    
    if (isDataResult(result)) {
      return NextResponse.json({
        success: true,
        data: result.data,
        error: result.error
      });
    } else {
      return NextResponse.json({
        success: false,
        data: [],
        error: result?.error || 'Failed to fetch weave types'
      });
    }
  } catch (error) {
    console.error('Admin weave types API error:', error);
    return NextResponse.json({
      success: false,
      data: [],
      error: 'Internal server error'
    }, { status: 500 });
  }
}
