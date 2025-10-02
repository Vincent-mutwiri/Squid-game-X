import connectToDatabase from './database';
import { Game } from '@/models/Game';
import { Player } from '@/models/Player';

const EXPIRY_HOURS = 24; // Games expire after 24 hours

export async function cleanupExpiredGames() {
  try {
    await connectToDatabase();
    
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() - EXPIRY_HOURS);
    
    // Find expired games
    const expiredGames = await Game.find({
      updatedAt: { $lt: expiryDate }
    });
    
    console.log(`Found ${expiredGames.length} expired games to cleanup`);
    
    // Delete associated players for each expired game
    for (const game of expiredGames) {
      if (game.players && game.players.length > 0) {
        await Player.deleteMany({ _id: { $in: game.players } });
      }
    }
    
    // Delete expired games
    const result = await Game.deleteMany({
      updatedAt: { $lt: expiryDate }
    });
    
    console.log(`Cleaned up ${result.deletedCount} expired games`);
    
    return {
      success: true,
      deletedCount: result.deletedCount,
      message: `Cleaned up ${result.deletedCount} expired games`
    };
  } catch (error) {
    console.error('Error cleaning up expired games:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function cleanupFinishedGames(hoursOld: number = 2) {
  try {
    await connectToDatabase();
    
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() - hoursOld);
    
    // Find finished games older than specified hours
    const finishedGames = await Game.find({
      status: 'finished',
      updatedAt: { $lt: expiryDate }
    });
    
    console.log(`Found ${finishedGames.length} finished games to cleanup`);
    
    // Delete associated players
    for (const game of finishedGames) {
      if (game.players && game.players.length > 0) {
        await Player.deleteMany({ _id: { $in: game.players } });
      }
    }
    
    // Delete finished games
    const result = await Game.deleteMany({
      status: 'finished',
      updatedAt: { $lt: expiryDate }
    });
    
    console.log(`Cleaned up ${result.deletedCount} finished games`);
    
    return {
      success: true,
      deletedCount: result.deletedCount,
      message: `Cleaned up ${result.deletedCount} finished games`
    };
  } catch (error) {
    console.error('Error cleaning up finished games:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
