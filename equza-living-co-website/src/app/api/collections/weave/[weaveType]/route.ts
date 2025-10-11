import { NextRequest, NextResponse } from 'next/server';
import { getSafeProductsByWeaveType } from '@/lib/firebase/safe-firestore';
import { isDataResult } from '@/types/safe';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ weaveType: string }> }
) {
  try {
    const { weaveType } = await params;

    if (!weaveType) {
      return NextResponse.json({
        success: false,
        data: [],
        error: 'Weave type is required'
      }, { status: 400 });
    }

    const result = await getSafeProductsByWeaveType(weaveType);
    
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
        error: result?.error || `No ${weaveType} products found`
      });
    }
  } catch (error) {
    console.error('Weave products API error:', error);
    return NextResponse.json({
      success: false,
      data: [],
      error: 'Internal server error'
    }, { status: 500 });
  }
}
