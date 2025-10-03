import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/database';
import { Game } from '@/models/Game';
import { Player } from '@/models/Player';

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const { pin } = await request.json();

    if (!pin) {
      return NextResponse.json({ message: 'PIN is required' }, { status: 400 });
    }

    const game = await Game.findOne({ pin: pin.toUpperCase() });

    if (!game) {
      return NextResponse.json({ message: 'Game not found' }, { status: 404 });
    }

    await Player.updateMany(
      { _id: { $in: game.players } },
      { 
        $set: { 
          isEliminated: false,
          score: 0,
          hasAnswered: false,
          answer: null
        } 
      }
    );

    game.status = 'lobby';
    game.currentQuestionIndex = 0;
    game.eliminatedPlayers = [];
    game.roundHistory = [];
    game.questionStartTime = undefined;
    
    await game.save();

    return NextResponse.json({ 
      success: true,
      message: 'Game restarted successfully',
      pin: game.pin
    });
  } catch (error) {
    console.error('Error restarting game:', error);
    return NextResponse.json(
      { message: 'Failed to restart game' },
      { status: 500 }
    );
  }
}
