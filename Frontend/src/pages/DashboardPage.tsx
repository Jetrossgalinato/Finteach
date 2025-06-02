import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { SunIcon, MoonIcon } from '@heroicons/react/16/solid';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import Sidebar from '../components/Sidebar';

type ActivityItem = {
  type: string;
  detail: string;
  date: string;
};

function DashBoard() {
  const [darkMode, setDarkMode] = useState(false);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();
  const [showChat, setShowChat] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { sender: 'ai', text: 'Hello! I am your Financial Advisor AI. How can I help you today?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatBoxWidth, setChatBoxWidth] = useState(384); 
  const [chatBoxHeight, setChatBoxHeight] = useState(384); 
  const [isResizing, setIsResizing] = useState(false);
  const chatBoxRef = useRef<HTMLDivElement>(null);

  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseNote, setExpenseNote] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [depositAccount, setDepositAccount] = useState('checking');

  const [checkingBalance, setCheckingBalance] = useState(0);
  const [savingsBalance, setSavingsBalance] = useState(0);
  const [investmentBalance, setInvestmentBalance] = useState(0);

  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [monthlyBudget, setMonthlyBudget] = useState(0);
  const [goals, setGoals] = useState<Goal[]>([]);

const now = new Date();
const currentMonth = now.getMonth();
const currentYear = now.getFullYear();

const monthlySpending = recentActivity
  .filter(item => {
    if (item.type !== 'expense') return false;
    const date = new Date(item.date);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  })
  .reduce((sum, item) => {
    const match = item.detail.match(/₱([\d,.]+)/);
    return sum + (match ? parseFloat(match[1].replace(/,/g, '')) : 0);
  }, 0);


const [isEditingBudget, setIsEditingBudget] = useState(monthlyBudget === 0);

type Goal = {
  id: number;
  name: string;
  current: number;
  target: number;
};

const [selectedGoalIdx, setSelectedGoalIdx] = useState<number | null>(null);

const [showAddGoal, setShowAddGoal] = useState(false);
const [goalName, setGoalName] = useState('');
const [goalTarget, setGoalTarget] = useState('');
const [goalCurrent, setGoalCurrent] = useState('');

const [editingGoalIdx, setEditingGoalIdx] = useState<number | null>(null);
const [editGoalName, setEditGoalName] = useState('');
const [editGoalTarget, setEditGoalTarget] = useState('');
const [editGoalCurrent, setEditGoalCurrent] = useState('');

    // Auth Guard: Check if the user is authenticated
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      navigate('/'); 
    }
  }, [navigate]);

    // Fetch the user's name from the Django backend
  useEffect(() => {
    const fetchUserName = async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        console.error('No access token found');
        return;
      }
  
      try {
        const response = await fetch('http://127.0.0.1:8000/accounts/api/user/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          credentials: 'include', // Include cookies if using session-based auth
        });
  
        if (response.ok) {
          const data = await response.json();
          setUserName(data.username); // Set the username from the backend
        } else if (response.status === 401) {
          console.error('Unauthorized: Invalid or expired token');
          navigate('/'); // Redirect to login page
        } else {
          console.error('Failed to fetch user details:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };
  
    fetchUserName();
  }, [navigate]);

    useEffect(() => {
    const savedMode = localStorage.getItem('theme');
    if (savedMode === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const startResizing = (e: React.MouseEvent) => {
  e.preventDefault();
  setIsResizing(true);
};

const fetchDashboardData = async () => {
  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) return;

  const res = await fetch('http://127.0.0.1:8000/accounts/api/dashboard/', {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  if (res.ok) {
    const data = await res.json();
    setCheckingBalance(data.checking_balance);
    setSavingsBalance(data.savings_balance);
    setInvestmentBalance(data.investment_balance);
    setRecentActivity(data.recent_activity);
    setMonthlyBudget(data.monthly_budget);
    setGoals(data.goals);
  }
};

useEffect(() => {
  fetchDashboardData();
}, []);

useEffect(() => {
  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing) return;
    // Calculate new width and height based on mouse position
    if (chatBoxRef.current) {
      const rect = chatBoxRef.current.getBoundingClientRect();
      const newWidth = Math.max(500, e.clientX - rect.left); 
      const newHeight = Math.max(320, rect.bottom - e.clientY); 
      setChatBoxWidth(newWidth);
      setChatBoxHeight(newHeight);
    }
  };
  const handleMouseUp = () => setIsResizing(false);

  if (isResizing) {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }
  return () => {
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  };
}, [isResizing]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    sessionStorage.removeItem('username');
    alert('You have been logged out.');
    navigate('/');
  };
  
    return (
        <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
            {/* Dark Mode Toggler */}
            <div className="absolute top-4 right-4">
                <button
                onClick={() => setDarkMode(!darkMode)}
                className="mt-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white px-3 py-1 rounded transition flex items-center justify-center"
                >
                {darkMode ? (
                    <SunIcon className="h-5 w-5 text-yellow-400" />
                ) : (
                    <MoonIcon className="h-5 w-5 text-gray-600" />
                )}
                </button>
            </div>

            {/* Sidebar */}
            <Sidebar handleLogout={handleLogout} />
            {/* Main Content */}
            <div className="flex-1 p-8 space-y-16">
                {/* Hero Section */}
                <section className="mt-9 text-center bg-blue-500 dark:bg-blue-700 text-white py-16 rounded-lg shadow-lg">
                <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
                <p className="text-lg mb-6">Hi! {userName}, this is your personalized financial dashboard.</p>
                <div className="space-x-4">
                    <button
                    className="bg-white dark:bg-gray-800 text-blue-500 dark:text-white px-6 py-2 rounded-md font-bold hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setShowChat(true)}
                    >
                    Talk to Our AI Advisor
                    </button>
                </div>
                </section>
                {/* Account Overview */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex flex-col items-center">
                    <span className="text-gray-500 dark:text-gray-300 text-sm mb-2">Checking Balance</span>
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">₱{checkingBalance.toFixed(2)}</span>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex flex-col items-center">
                    <span className="text-gray-500 dark:text-gray-300 text-sm mb-2">Savings Balance</span>
                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">₱{savingsBalance.toFixed(2)}</span>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex flex-col items-center">
                    <span className="text-gray-500 dark:text-gray-300 text-sm mb-2">Investments</span>
                    <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">₱{investmentBalance.toFixed(2)}</span>
                  </div>
                </section>
                <div className="flex flex-col md:flex-row gap-8 max-w-3xl mx-auto mt-8">
                  {/* Expense Entry Form */}
                  <section className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Enter Today's Expense</h2>
                    <form
                      onSubmit={async e => {
                      e.preventDefault();
                      const amount = parseFloat(expenseAmount);
                      if (isNaN(amount) || amount <= 0) return;
                      const accessToken = localStorage.getItem('accessToken');
                      const res = await fetch('http://127.0.0.1:8000/accounts/api/transaction/', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                          Authorization: `Bearer ${accessToken}`,
                        },
                        body: JSON.stringify({
                          type: 'expense',
                          account: 'checking',
                          amount,
                          note: expenseNote,
                        }),
                      });
                      if (res.ok) {
                        // Re-fetch dashboard data to update balances and activity
                        await fetchDashboardData();
                        setExpenseAmount('');
                        setExpenseNote('');
                      }
                    }}
                      className="flex flex-col gap-4"
                    >
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={expenseAmount}
                        onChange={e => setExpenseAmount(e.target.value)}
                        placeholder="Amount (e.g. 25.50)"
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none"
                        required
                      />
                      <input
                        type="text"
                        value={expenseNote}
                        onChange={e => setExpenseNote(e.target.value)}
                        placeholder="Note (optional)"
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="bg-blue-500 dark:bg-blue-700 text-white px-4 py-2 rounded font-bold hover:bg-blue-600 dark:hover:bg-blue-800"
                      >
                        Add Expense
                      </button>
                    </form>
                  </section>

                  {/* Deposit Funds Form */}
                  <section className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Deposit Funds</h2>
                    <form
                      onSubmit={async e => {
                      e.preventDefault();
                      const amount = parseFloat(depositAmount);
                      if (isNaN(amount) || amount <= 0) return;
                      const accessToken = localStorage.getItem('accessToken');
                      const body: {
                        type: string;
                        account: string;
                        amount: number;
                        goal_id?: number;
                      } = {
                        type: 'deposit',
                        account: depositAccount,
                        amount,
                      };
                      if (depositAccount === 'savings' && selectedGoalIdx !== null && goals[selectedGoalIdx]) {
                        body.goal_id = goals[selectedGoalIdx].id;
                      }
                      const res = await fetch('http://127.0.0.1:8000/accounts/api/transaction/', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                          Authorization: `Bearer ${accessToken}`,
                        },
                        body: JSON.stringify(body),
                      });
                      if (res.ok) {
                        await fetchDashboardData();
                        setDepositAmount('');
                        setSelectedGoalIdx(null);
                      }
                    }}
                      className="flex flex-col gap-4"
                    >
                      <select
                        value={depositAccount}
                        onChange={e => setDepositAccount(e.target.value)}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none"
                      >
                        <option value="checking">Current</option>
                        <option value="savings">Savings</option>
                        <option value="investments">Investments</option>
                      </select>

                      {/* Show goal selector if savings is selected and there are goals */}
                      {depositAccount === 'savings' && goals.length > 0 && (
                        <select
                          value={selectedGoalIdx !== null ? selectedGoalIdx : ''}
                          onChange={e => setSelectedGoalIdx(e.target.value === '' ? null : Number(e.target.value))}
                          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none"
                        >
                          <option value="">Select Financial Goal (optional)</option>
                          {goals.map((goal, idx) => (
                            <option key={idx} value={idx}>{goal.name}</option>
                          ))}
                        </select>
                      )}

                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={depositAmount}
                        onChange={e => setDepositAmount(e.target.value)}
                        placeholder="Amount (e.g. 100.00)"
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none"
                        required
                      />
                      <button
                        type="submit"
                        className="bg-green-500 dark:bg-green-700 text-white px-4 py-2 rounded font-bold hover:bg-green-600 dark:hover:bg-green-800"
                      >
                        Add Funds
                      </button>
                    </form>
                  </section>
                </div>
                {/* Recent Activity */}
                <section className="max-w-3xl mx-auto mt-8 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Recent Activity</h2>
                  {recentActivity.length === 0 ? (
                    <div className="text-gray-500 dark:text-gray-400">No recent activity yet.</div>
                  ) : (
                    <ul className="space-y-2">
                      {recentActivity.map((item, idx) => (
                        <li key={idx} className="flex items-center justify-between text-gray-800 dark:text-gray-200">
                          <span>{item.detail}</span>
                          <span className="text-xs text-gray-600 dark:text-gray-300">{item.date}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {/* Example notification */}
                  <div className="mt-4 p-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                    <span>Tip: Stay on track with your monthly budget!</span>
                  </div>
                </section>

                {/* Budget Summary */}
                <section className="max-w-3xl mx-auto mt-8 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Budget Summary</h2>
                  <div className="mb-2 text-gray-600 dark:text-gray-300 text-sm">
                    {now.toLocaleString('default', { month: 'long', year: 'numeric' })}
                  </div>
                  {isEditingBudget ? (
                    <form
                      className="flex flex-col md:flex-row gap-4 mb-4"
                      onSubmit={async e => {
                        e.preventDefault();
                        const accessToken = localStorage.getItem('accessToken');
                        const res = await fetch('http://127.0.0.1:8000/accounts/api/budget/', {
                          method: 'PATCH',
                          headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${accessToken}`,
                          },
                          body: JSON.stringify({ monthly_budget: monthlyBudget }),
                        });
                        if (res.ok) {
                          await fetchDashboardData();
                          setIsEditingBudget(false);
                        }
                      }}
                    >
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={monthlyBudget === 0 ? '' : monthlyBudget}
                        onChange={e => setMonthlyBudget(parseFloat(e.target.value))}
                        placeholder="Enter your monthly budget"
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none flex-1"
                        required
                      />
                      <button
                        type="submit"
                        className="bg-blue-500 dark:bg-blue-700 text-white px-4 py-2 rounded font-bold hover:bg-blue-600 dark:hover:bg-blue-800"
                      >
                        Save
                      </button>
                    </form>
                  ) : (
                    <div className="mb-4">
                      <span className="block text-gray-700 dark:text-gray-300 mb-2">This Month's Spending</span>
                      {/* Bar chart */}
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded h-4 mb-2 relative">
                        <div
                          className="bg-green-500 h-4 rounded"
                          style={{
                            width: monthlyBudget > 0
                              ? `${Math.min(100, (monthlySpending / monthlyBudget) * 100)}%`
                              : '0%',
                            transition: 'width 0.5s'
                          }}
                        ></div>
                        <button
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-blue-600 dark:text-blue-300 underline"
                          onClick={() => setIsEditingBudget(true)}
                        >
                          Edit
                        </button>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                        <span>₱{monthlySpending.toLocaleString()} spent</span>
                        <span>₱{monthlyBudget.toLocaleString()} budget</span>
                      </div>
                    </div>
                  )}
                </section>

                {/* Financial Goals */}
                <section className="max-w-3xl mx-auto mt-8 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Financial Goals</h2>
                  {goals.length === 0 && !showAddGoal && (
                    <div className="text-gray-500 dark:text-gray-400 mb-4">No goals yet. Start by adding a financial goal!</div>
                  )}

                  {goals.length > 0 && (
                    <div className="space-y-4 mb-4">
                      {goals.map((goal, idx) => (
                        <div key={idx}>
                          {editingGoalIdx === idx ? (
                            <form
                              className="flex flex-col gap-2 mb-2"
                              onSubmit={async e => {
                                e.preventDefault();
                                const accessToken = localStorage.getItem('accessToken');
                                const goalId = goals[idx].id;
                                const res = await fetch(`http://127.0.0.1:8000/accounts/api/goals/${goalId}/`, {
                                  method: 'PATCH',
                                  headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: `Bearer ${accessToken}`,
                                  },
                                  body: JSON.stringify({
                                    name: editGoalName,
                                    target: parseFloat(editGoalTarget),
                                    current: editGoalCurrent ? parseFloat(editGoalCurrent) : 0,
                                  }),
                                });
                                if (res.ok) {
                                  await fetchDashboardData();
                                  setEditingGoalIdx(null);
                                }
                              }}
                            >
                              <input
                                type="text"
                                value={editGoalName}
                                onChange={e => setEditGoalName(e.target.value)}
                                placeholder="Goal name"
                                className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded mb-2"
                                required
                              />
                              <input
                                type="number"
                                min="1"
                                step="0.01"
                                value={editGoalTarget}
                                onChange={e => setEditGoalTarget(e.target.value)}
                                placeholder="Target amount"
                                className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded mb-2"
                                required
                              />
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={editGoalCurrent}
                                onChange={e => setEditGoalCurrent(e.target.value)}
                                placeholder="Current amount"
                                className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded mb-2"
                              />
                              <div className="flex gap-2">
                                <button
                                  type="submit"
                                  className="bg-green-500 dark:bg-green-700 text-white px-4 py-2 rounded font-bold hover:bg-green-600 dark:hover:bg-green-800"
                                >
                                  Save
                                </button>
                                <button
                                  type="button"
                                  className="bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white px-4 py-2 rounded font-bold hover:bg-gray-400 dark:hover:bg-gray-700"
                                  onClick={() => setEditingGoalIdx(null)}
                                >
                                  Cancel
                                </button>
                              </div>
                            </form>
                          ) : (
                            <>
                              <span className="block text-gray-700 dark:text-gray-300 mb-1">{goal.name}</span>
                              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded h-4 mb-1">
                                <div
                                  className="h-4 rounded"
                                  style={{
                                    width: `${Math.min(100, (goal.current / goal.target) * 100)}%`,
                                    backgroundColor: idx % 2 === 0 ? '#3b82f6' : '#a21caf'
                                  }}
                                ></div>
                              </div>
                              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 items-center">
                                <span>₱{goal.current.toLocaleString()} / ₱{goal.target.toLocaleString()}</span>
                                <button
                                  className="text-xs text-blue-600 dark:text-blue-300 underline ml-2"
                                  onClick={() => {
                                    setEditingGoalIdx(idx);
                                    setEditGoalName(goal.name);
                                    setEditGoalTarget(goal.target.toString());
                                    setEditGoalCurrent(goal.current.toString());
                                  }}
                                >
                                  Edit
                                </button>
                                <button
                                  className="text-xs text-red-600 dark:text-red-300 underline ml-2"
                                  onClick={async () => {
                                    const accessToken = localStorage.getItem('accessToken');
                                    const goalId = goal.id;
                                    const res = await fetch(`http://127.0.0.1:8000/accounts/api/goals/${goalId}/delete/`, {
                                      method: 'DELETE',
                                      headers: {
                                        Authorization: `Bearer ${accessToken}`,
                                      },
                                    });
                                    if (res.ok) {
                                      await fetchDashboardData();
                                    }
                                  }}
                                >
                                  Delete
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {showAddGoal ? (
                    <form
                      className="flex flex-col gap-2 mt-4"
                      onSubmit={async e => {
                        e.preventDefault();
                        if (!goalName || !goalTarget) return;
                        const accessToken = localStorage.getItem('accessToken');
                        const res = await fetch('http://127.0.0.1:8000/accounts/api/goals/', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${accessToken}`,
                          },
                          body: JSON.stringify({
                            name: goalName,
                            target: parseFloat(goalTarget),
                            current: goalCurrent ? parseFloat(goalCurrent) : 0,
                          }),
                        });
                        if (res.ok) {
                          await fetchDashboardData();
                          setGoalName('');
                          setGoalTarget('');
                          setGoalCurrent('');
                          setShowAddGoal(false);
                        }
                      }}
                    >
                      <input
                        type="text"
                        value={goalName}
                        onChange={e => setGoalName(e.target.value)}
                        placeholder="Goal name (e.g. Emergency Fund)"
                        className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded flex-1 mb-2"
                        required
                      />
                      <input
                        type="number"
                        min="1"
                        step="0.01"
                        value={goalTarget}
                        onChange={e => setGoalTarget(e.target.value)}
                        placeholder="Target amount"
                        className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded flex-1 mb-2"
                        required
                      />
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={goalCurrent}
                        onChange={e => setGoalCurrent(e.target.value)}
                        placeholder="Current amount"
                        className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded flex-1 mb-2"
                      />
                      <div className="flex gap-2">
                        <button
                          type="submit"
                          className="bg-green-500 dark:bg-green-700 text-white px-4 py-2 rounded font-bold hover:bg-green-600 dark:hover:bg-green-800"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          className="bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white px-4 py-2 rounded font-bold hover:bg-gray-400 dark:hover:bg-gray-700"
                          onClick={() => setShowAddGoal(false)}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <button
                      className="mt-4 bg-green-500 dark:bg-green-700 text-white px-4 py-2 rounded font-bold hover:bg-green-600 dark:hover:bg-green-800"
                      onClick={() => setShowAddGoal(true)}
                    >
                      Add Goal
                    </button>
                  )}
                </section>
            </div>
            
            {/* AI Chatbox */}
            {showChat && (
                <div
                ref={chatBoxRef}
                className="fixed bottom-0 right-0 z-50 bg-white dark:bg-gray-800 border-l border-t border-gray-300 dark:border-gray-700 rounded-tl-lg shadow-lg flex flex-col"
                style={{
                    width: `${chatBoxWidth}px`,
                    height: `${chatBoxHeight}px`,
                    minWidth: '320px',
                    minHeight: '320px',
                    maxWidth: '100vw',
                    maxHeight: '100vh',
                    transition: isResizing ? 'none' : 'width 0.1s, height 0.1s'
                }}
                >
                {/* Draggable/Resizable Handle */}
                <div
                    onMouseDown={startResizing}
                    className="absolute top-0 left-0 z-50 cursor-nwse-resize bg-blue-500 rounded-tl-lg"
                    style={{ width: 20, height: 20 }}
                    title="Drag to resize"
                ></div>
                {/* Chatbox header and rest of your chatbox code... */}
                <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
                    <span className="font-bold text-gray-800 dark:text-gray-200">AI Financial Advisor</span>
                    <button
                    onClick={() => setShowChat(false)}
                    className="text-gray-500 hover:text-red-500 text-xl font-bold"
                    aria-label="Close chat"
                    >
                    ×
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {chatMessages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`px-3 py-2 rounded-lg text-sm max-w-xs
                        ${msg.sender === 'user'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                        }`}>
                        {msg.text}
                        </div>
                    </div>
                    ))}
                    {isLoading && (
                    <div className="flex justify-start">
                        <div className="px-3 py-2 rounded-lg text-sm bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 animate-pulse">
                        AI is typing...
                        </div>
                    </div>
                    )}
                </div>
                <form
                    className="flex p-4 border-t border-gray-200 dark:border-gray-700"
                    onSubmit={async (e) => {
                    e.preventDefault();
                    if (!chatInput.trim()) return;
                    const userMessage = chatInput;
                    setChatMessages((msgs) => [...msgs, { sender: 'user', text: userMessage }]);
                    setChatInput('');
                    setIsLoading(true);

                    // Call your AI backend here
                    try {
                        const accessToken = localStorage.getItem('accessToken');
                        const response = await fetch('http://127.0.0.1:8000/accounts/api/ai-chat/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${accessToken}`,
                        },
                        body: JSON.stringify({ message: userMessage }),
                        });
                        const data = await response.json();
                        const aiReply = data.reply || "I'm here to help with financial topics. Please ask a finance-related question!";
                        setChatMessages((msgs) => [...msgs, { sender: 'ai', text: aiReply }]);
                    } catch {
                        setChatMessages((msgs) => [...msgs, { sender: 'ai', text: "Sorry, I couldn't process your request. Please try again." }]);
                    }
                    setIsLoading(false);
                    }}
                >
                    <input
                    type="text"
                    className="flex-1 px-3 py-2 rounded-l border border-gray-300 dark:border-gray-600 focus:outline-none"
                    placeholder="Ask a financial question..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    disabled={isLoading}
                    />
                    <button
                    type="submit"
                    className="bg-blue-500 dark:bg-blue-700 text-white px-4 py-2 rounded-r font-bold hover:bg-blue-600 dark:hover:bg-blue-800 flex items-center justify-center"
                    disabled={isLoading}
                    >
                    <PaperAirplaneIcon className="h-5 w-5" />
                    </button>
                </form>
                </div>
            )}
        </div>
    );
}
export default DashBoard;