import { NextResponse } from 'next/server';
import { cleanupExpiredGames, cleanupFinishedGames } from '@/lib/gameExpiry';

export async function POST(request: Request) {
  try {
    const { type } = await request.json();
    
    let result;
    if (type === 'finished') {
      result = await cleanupFinishedGames(2);
    } else {
      result = await cleanupExpiredGames();
    }
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Cleanup error:', error);
    return NextResponse.json(
      { success: false, message: 'Cleanup failed' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const [expiredResult, finishedResult] = await Promise.all([
      cleanupExpiredGames(),
      cleanupFinishedGames(2)
    ]);
    
    return NextResponse.json({
      success: true,
      expired: expiredResult,
      finished: finishedResult,
      totalDeleted: (expiredResult.deletedCount || 0) + (finishedResult.deletedCount || 0)
    });
  } catch (error) {
    console.error('Cleanup error:', error);
    return NextResponse.json(
      { success: false, message: 'Cleanup failed' },
      { status: 500 }
    );
  }
}
