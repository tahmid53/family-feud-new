"use client";

import { useState, useEffect } from 'react';
import { useSocket } from '../../../lib/socket/socket-context';
import Head from 'next/head';

export default function FastMoneyPage() {
  const { socket, isConnected, isHost } = useSocket();
  const [currentPlayer, setCurrentPlayer] = useState(1); // 1 or 2
  const [timeLeft, setTimeLeft] = useState(20);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [questions, setQuestions] = useState([
    { id: 1, text: "Name a fruit that's yellow.", answers: [] },
    { id: 2, text: "Name something you take to the beach.", answers: [] },
    { id: 3, text: "Name a famous cartoon mouse.", answers: [] },
    { id: 4, text: "Name something you do before going to bed.", answers: [] },
    { id: 5, text: "Name a place where people go to exercise.", answers: [] },
  ]);
  const [player1Answers, setPlayer1Answers] = useState(Array(5).fill(''));
  const [player1Points, setPlayer1Points] = useState(Array(5).fill(0));
  const [player2Answers, setPlayer2Answers] = useState(Array(5).fill(''));
  const [player2Points, setPlayer2Points] = useState(Array(5).fill(0));
  const [totalPoints, setTotalPoints] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  // Timer effect
  useEffect(() => {
    let timer;
    if (isTimerRunning && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (isTimerRunning && timeLeft === 0) {
      setIsTimerRunning(false);
      if (isHost) {
        socket?.emit('fast_money_time_up', { player: currentPlayer });
      }
    }
    
    return () => clearTimeout(timer);
  }, [isTimerRunning, timeLeft, currentPlayer, isHost, socket]);
  
  // Socket event listeners
  useEffect(() => {
    if (socket && isConnected) {
      socket.on('fast_money_start', (data) => {
        setQuestions(data.questions);
        setCurrentPlayer(1);
        setTimeLeft(20);
        setIsTimerRunning(true);
        setShowResults(false);
        setPlayer1Answers(Array(5).fill(''));
        setPlayer1Points(Array(5).fill(0));
        setPlayer2Answers(Array(5).fill(''));
        setPlayer2Points(Array(5).fill(0));
        setTotalPoints(0);
        setCurrentQuestionIndex(0);
      });
      
      socket.on('fast_money_next_player', () => {
        setCurrentPlayer(2);
        setTimeLeft(20);
        setIsTimerRunning(true);
        setCurrentQuestionIndex(0);
      });
      
      socket.on('fast_money_answer_update', (data) => {
        const { player, index, answer, points } = data;
        
        if (player === 1) {
          setPlayer1Answers(prev => {
            const newAnswers = [...prev];
            newAnswers[index] = answer;
            return newAnswers;
          });
          
          setPlayer1Points(prev => {
            const newPoints = [...prev];
            newPoints[index] = points;
            return newPoints;
          });
        } else {
          setPlayer2Answers(prev => {
            const newAnswers = [...prev];
            newAnswers[index] = answer;
            return newAnswers;
          });
          
          setPlayer2Points(prev => {
            const newPoints = [...prev];
            newPoints[index] = points;
            return newPoints;
          });
        }
      });
      
      socket.on('fast_money_show_results', (data) => {
        setShowResults(true);
        setTotalPoints(data.totalPoints);
      });
      
      return () => {
        socket.off('fast_money_start');
        socket.off('fast_money_next_player');
        socket.off('fast_money_answer_update');
        socket.off('fast_money_show_results');
      };
    }
  }, [socket, isConnected]);
  
  // Host controls
  const startTimer = () => {
    if (isHost) {
      setTimeLeft(20);
      setIsTimerRunning(true);
      socket?.emit('fast_money_start_timer', { player: currentPlayer });
    }
  };
  
  const stopTimer = () => {
    if (isHost) {
      setIsTimerRunning(false);
      socket?.emit('fast_money_stop_timer', { player: currentPlayer });
    }
  };
  
  const nextPlayer = () => {
    if (isHost) {
      setCurrentPlayer(2);
      setTimeLeft(20);
      setIsTimerRunning(true);
      setCurrentQuestionIndex(0);
      socket?.emit('fast_money_next_player');
    }
  };
  
  const showFinalResults = () => {
    if (isHost) {
      const total = player1Points.reduce((sum, points) => sum + points, 0) + 
                   player2Points.reduce((sum, points) => sum + points, 0);
      
      setTotalPoints(total);
      setShowResults(true);
      socket?.emit('fast_money_show_results', { totalPoints: total });
    }
  };
  
  const updateAnswer = (player, index, answer, points) => {
    if (isHost) {
      socket?.emit('fast_money_answer_update', { player, index, answer, points });
    }
  };
  
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };
  
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  return (
    <>
      <Head>
        <title>Family Feud - Fast Money Round</title>
        <meta name="description" content="Family Feud Fast Money Round" />
      </Head>
      
      <main className="min-h-screen bg-blue-900 text-white">
        <div className="bg-blue-950 p-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-yellow-400">FAST MONEY</h1>
          <div className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-2xl">
            {timeLeft}s
          </div>
        </div>
        
        {!showResults ? (
          <div className="p-4">
            <div className="bg-blue-800 rounded-lg p-4 mb-4">
              <h2 className="text-xl font-bold mb-2">
                Player {currentPlayer} - Question {currentQuestionIndex + 1}
              </h2>
              <p className="text-2xl font-bold text-yellow-400">
                {questions[currentQuestionIndex]?.text}
              </p>
            </div>
            
            {isHost && (
              <div className="bg-blue-800 rounded-lg p-4 mb-4">
                <h3 className="text-lg font-bold mb-2">Host Controls</h3>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <button 
                    onClick={startTimer}
                    className="bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4 rounded"
                  >
                    Start Timer
                  </button>
                  <button 
                    onClick={stopTimer}
                    className="bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 rounded"
                  >
                    Stop Timer
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <button 
                    onClick={handlePrevQuestion}
                    disabled={currentQuestionIndex === 0}
                    className={`font-bold py-2 px-4 rounded ${
                      currentQuestionIndex === 0 
                        ? 'bg-gray-500 cursor-not-allowed' 
                        : 'bg-blue-500 hover:bg-blue-400 text-white'
                    }`}
                  >
                    Previous Question
                  </button>
                  <button 
                    onClick={handleNextQuestion}
                    disabled={currentQuestionIndex === questions.length - 1}
                    className={`font-bold py-2 px-4 rounded ${
                      currentQuestionIndex === questions.length - 1 
                        ? 'bg-gray-500 cursor-not-allowed' 
                        : 'bg-blue-500 hover:bg-blue-400 text-white'
                    }`}
                  >
                    Next Question
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  {currentPlayer === 1 ? (
                    <button 
                      onClick={nextPlayer}
                      className="bg-yellow-500 hover:bg-yellow-400 text-blue-900 font-bold py-2 px-4 rounded"
                    >
                      Next Player
                    </button>
                  ) : (
                    <button 
                      onClick={showFinalResults}
                      className="bg-yellow-500 hover:bg-yellow-400 text-blue-900 font-bold py-2 px-4 rounded"
                    >
                      Show Results
                    </button>
                  )}
                </div>
                
                <div className="mt-4">
                  <h3 className="text-lg font-bold mb-2">Answer Input</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Answer
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 rounded bg-blue-700 border border-blue-600 text-white"
                        placeholder="Enter answer"
                        value={currentPlayer === 1 ? player1Answers[currentQuestionIndex] : player2Answers[currentQuestionIndex]}
                        onChange={(e) => {
                          if (currentPlayer === 1) {
                            const newAnswers = [...player1Answers];
                            newAnswers[currentQuestionIndex] = e.target.value;
                            setPlayer1Answers(newAnswers);
                          } else {
                            const newAnswers = [...player2Answers];
                            newAnswers[currentQuestionIndex] = e.target.value;
                            setPlayer2Answers(newAnswers);
                          }
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Points
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        className="w-full px-4 py-2 rounded bg-blue-700 border border-blue-600 text-white"
                        placeholder="Points"
                        value={currentPlayer === 1 ? player1Points[currentQuestionIndex] : player2Points[currentQuestionIndex]}
                        onChange={(e) => {
                          const points = parseInt(e.target.value) || 0;
                          if (currentPlayer === 1) {
                            const newPoints = [...player1Points];
                            newPoints[currentQuestionIndex] = points;
                            setPlayer1Points(newPoints);
                          } else {
                            const newPoints = [...player2Points];
                            newPoints[currentQuestionIndex] = points;
                            setPlayer2Points(newPoints);
                          }
                        }}
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => updateAnswer(
                      currentPlayer,
                      currentQuestionIndex,
                      currentPlayer === 1 ? player1Answers[currentQuestionIndex] : player2Answers[currentQuestionIndex],
                      currentPlayer === 1 ? player1Points[currentQuestionIndex] : player2Points[currentQuestionIndex]
                    )}
                    className="mt-2 bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4 rounded"
                  >
                    Update Answer
                  </button>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-800 rounded-lg p-4">
                <h3 className="text-lg font-bold mb-2">Player 1 Answers</h3>
                <div className="space-y-2">
                  {questions.map((question, index) => (
                    <div key={index} className="flex justify-between items-center bg-blue-700 p-2 rounded">
                      <div className="flex-1">
                        <div className="text-sm text-gray-300">Q{index + 1}: {question.text}</div>
                        <div>{player1Answers[index] || '-'}</div>
                      </div>
                      <div className="bg-yellow-400 text-blue-900 px-2 py-1 rounded font-bold">
                        {player1Points[index]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {currentPlayer === 2 && (
                <div className="bg-blue-800 rounded-lg p-4">
                  <h3 className="text-lg font-bold mb-2">Player 2 Answers</h3>
                  <div className="space-y-2">
                    {questions.map((question, index) => (
                      <div key={index} className="flex justify-between items-center bg-blue-700 p-2 rounded">
                        <div className="flex-1">
                          <div className="text-sm text-gray-300">Q{index + 1}: {question.text}</div>
                          <div>{player2Answers[index] || '-'}</div>
                        </div>
                        <div className="bg-yellow-400 text-blue-900 px-2 py-1 rounded font-bold">
                          {player2Points[index]}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="p-4 flex flex-col items-center justify-center">
            <div className="bg-blue-800 rounded-lg p-6 text-center max-w-2xl w-full">
              <h2 className="text-3xl font-bold mb-6">Final Results</h2>
              
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-xl font-bold mb-4">Player 1</h3>
                  <div className="space-y-2">
                    {questions.map((question, index) => (
                      <div key={index} className="flex justify-between items-center bg-blue-700 p-2 rounded">
                        <div>{player1Answers[index] || '-'}</div>
                        <div className="bg-yellow-400 text-blue-900 px-2 py-1 rounded font-bold">
                          {player1Points[index]}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 text-right font-bold">
                    Total: {player1Points.reduce((sum, points) => sum + points, 0)}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold mb-4">Player 2</h3>
                  <div className="space-y-2">
                    {questions.map((question, index) => (
                      <div key={index} className="flex justify-between items-center bg-blue-700 p-2 rounded">
                        <div>{player2Answers[index] || '-'}</div>
                        <div className="bg-yellow-400 text-blue-900 px-2 py-1 rounded font-bold">
                          {player2Points[index]}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 text-right font-bold">
                    Total: {player2Points.reduce((sum, points) => sum + points, 0)}
                  </div>
                </div>
              </div>
              
              <div className="text-4xl font-bold text-yellow-400 mb-6">
                Grand Total: {totalPoints}
              </div>
              
              <div className="text-2xl font-bold">
                {totalPoints >= 200 ? (
                  <div className="text-green-400">You Win $20,000!</div>
                ) : (
                  <div className="text-red-400">Sorry, you needed 200 points to win.</div>
                )}
              </div>
              
              {isHost && (
                <button
                  onClick={() => {
                    socket?.emit('fast_money_end');
                  }}
                  className="mt-6 bg-yellow-500 hover:bg-yellow-400 text-blue-900 font-bold py-3 px-6 rounded"
                >
                  Return to Game
                </button>
              )}
            </div>
          </div>
        )}
      </main>
    </>
  );
}
