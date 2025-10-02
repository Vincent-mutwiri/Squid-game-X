import { NextResponse } from 'next/server';
import { cleanupExpiredGames, cleanupFinishedGames } from '@/lib/gameExpiry';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log('Running scheduled game cleanup...');
    
    const [expiredResult, finishedResult] = await Promise.all([
      cleanupExpiredGames(),
      cleanupFinishedGames(2)
    ]);
    
    const totalDeleted = (expiredResult.deletedCount || 0) + (finishedResult.deletedCount || 0);
    
    console.log(`Cleanup complete: ${totalDeleted} games deleted`);
    
    return NextResponse.json({
      success: true,
      expired: expiredResult,
      finished: finishedResult,
      totalDeleted,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Scheduled cleanup error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Cleanup failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
