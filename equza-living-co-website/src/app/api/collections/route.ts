import { NextRequest, NextResponse } from 'next/server';
import { getSafeStyleCollections, getSafeSpaceCollections } from '@/lib/firebase/safe-firestore';
import { isDataResult } from '@/types/safe';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    if (type === 'style') {
      const result = await getSafeStyleCollections();
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
          error: result?.error || 'Failed to fetch style collections'
        });
      }
    } else if (type === 'space') {
      const result = await getSafeSpaceCollections();
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
          error: result?.error || 'Failed to fetch space collections'
        });
      }
    } else {
      // Fetch both types
      const [styleResult, spaceResult] = await Promise.all([
        getSafeStyleCollections(),
        getSafeSpaceCollections(),
      ]);

      return NextResponse.json({
        success: true,
        data: {
          style: isDataResult(styleResult) ? styleResult.data : [],
          space: isDataResult(spaceResult) ? spaceResult.data : [],
        },
        error: {
          style: isDataResult(styleResult) ? styleResult.error : styleResult?.error,
          space: isDataResult(spaceResult) ? spaceResult.error : spaceResult?.error,
        }
      });
    }
  } catch (error) {
    console.error('Collections API error:', error);
    return NextResponse.json({
      success: false,
      data: { style: [], space: [] },
      error: 'Internal server error'
    }, { status: 500 });
  }
}
