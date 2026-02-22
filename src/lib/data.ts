export interface Scripture {
  id: string;
  verse: string;
  reference: string;
  theme: "stewardship" | "discipline" | "generosity" | "peace" | "wisdom" | "diligence";
}

export const SCRIPTURES: Scripture[] = [
  { id: "s1", verse: "Bring the whole tithe into the storehouse, that there may be food in my house.", reference: "Malachi 3:10", theme: "generosity" },
  { id: "s2", verse: "Honor the Lord with your wealth, with the firstfruits of all your crops.", reference: "Proverbs 3:9", theme: "stewardship" },
  { id: "s3", verse: "The plans of the diligent lead to profit as surely as haste leads to poverty.", reference: "Proverbs 21:5", theme: "diligence" },
  { id: "s4", verse: "Do not be anxious about anything, but in every situation, by prayer and petition, present your requests to God.", reference: "Philippians 4:6", theme: "peace" },
  { id: "s5", verse: "For I know the plans I have for you, plans to prosper you and not to harm you.", reference: "Jeremiah 29:11", theme: "peace" },
  { id: "s6", verse: "Whoever can be trusted with very little can also be trusted with much.", reference: "Luke 16:10", theme: "stewardship" },
  { id: "s7", verse: "The generous will themselves be blessed, for they share their food with the poor.", reference: "Proverbs 22:9", theme: "generosity" },
  { id: "s8", verse: "Lazy hands make for poverty, but diligent hands bring wealth.", reference: "Proverbs 10:4", theme: "diligence" },
  { id: "s9", verse: "If any of you lacks wisdom, you should ask God, who gives generously to all.", reference: "James 1:5", theme: "wisdom" },
  { id: "s10", verse: "For the love of money is a root of all kinds of evil.", reference: "1 Timothy 6:10", theme: "wisdom" },
  { id: "s11", verse: "A good person leaves an inheritance for their children's children.", reference: "Proverbs 13:22", theme: "stewardship" },
  { id: "s12", verse: "Give, and it will be given to you. A good measure, pressed down, shaken together.", reference: "Luke 6:38", theme: "generosity" },
  { id: "s13", verse: "No one can serve two masters. Either you will hate the one and love the other.", reference: "Matthew 6:24", theme: "wisdom" },
  { id: "s14", verse: "The Lord your God will bless you in all your work and in everything you put your hand to.", reference: "Deuteronomy 15:10", theme: "diligence" },
  { id: "s15", verse: "She watches over the affairs of her household and does not eat the bread of idleness.", reference: "Proverbs 31:27", theme: "discipline" },
  { id: "s16", verse: "A feast is made for laughter, wine makes life merry, and money is the answer for everything.", reference: "Ecclesiastes 10:19", theme: "wisdom" },
  { id: "s17", verse: "But seek first his kingdom and his righteousness, and all these things will be given to you.", reference: "Matthew 6:33", theme: "peace" },
  { id: "s18", verse: "I have learned, in whatever state I am, to be content.", reference: "Philippians 4:11", theme: "discipline" },
  { id: "s19", verse: "The rich rule over the poor, and the borrower is slave to the lender.", reference: "Proverbs 22:7", theme: "discipline" },
  { id: "s20", verse: "By wisdom a house is built, and through understanding it is established.", reference: "Proverbs 24:3", theme: "wisdom" },
  { id: "s21", verse: "Commit to the Lord whatever you do, and he will establish your plans.", reference: "Proverbs 16:3", theme: "diligence" },
  { id: "s22", verse: "And my God will meet all your needs according to the riches of his glory.", reference: "Philippians 4:19", theme: "peace" },
  { id: "s23", verse: "Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion.", reference: "2 Corinthians 9:7", theme: "generosity" },
  { id: "s24", verse: "Plans fail for lack of counsel, but with many advisers they succeed.", reference: "Proverbs 15:22", theme: "wisdom" },
  { id: "s25", verse: "In the house of the wise are stores of choice food and oil, but a foolish man devours all he has.", reference: "Proverbs 21:20", theme: "stewardship" },
  { id: "s26", verse: "Cast all your anxiety on him because he cares for you.", reference: "1 Peter 5:7", theme: "peace" },
  { id: "s27", verse: "Do not store up for yourselves treasures on earth, where moths and vermin destroy.", reference: "Matthew 6:19", theme: "stewardship" },
  { id: "s28", verse: "All hard work brings a profit, but mere talk leads only to poverty.", reference: "Proverbs 14:23", theme: "diligence" },
  { id: "s29", verse: "The Lord makes firm the steps of the one who delights in him.", reference: "Psalm 37:23", theme: "discipline" },
  { id: "s30", verse: "Trust in the Lord with all your heart and lean not on your own understanding.", reference: "Proverbs 3:5", theme: "wisdom" },
];

export const THEME_FOR_GOAL: Record<string, Scripture["theme"][]> = {
  budget_discipline: ["discipline", "stewardship", "wisdom"],
  debt_reset: ["discipline", "wisdom", "peace"],
  savings_growth: ["stewardship", "diligence", "wisdom"],
  giving_consistency: ["generosity", "stewardship", "peace"],
};

export function getDailyScripture(goal: string, dayIndex: number): Scripture {
  const themes = THEME_FOR_GOAL[goal] || ["wisdom", "stewardship", "diligence"];
  const themeScriptures = SCRIPTURES.filter((s) => themes.includes(s.theme));
  return themeScriptures[dayIndex % themeScriptures.length];
}

// 90-day reset plan: 12 weeks × 7 days
export interface DayTask {
  id: string;
  week: number;
  day: number; // 1-7
  title: string;
  description: string;
  type: "reflection" | "action" | "prayer" | "study";
  theme: string;
}

export const RESET_PLAN_TASKS: DayTask[] = [
  // Week 1 – Foundation
  { id: "w1d1", week: 1, day: 1, title: "Set your intention", description: "Write down why you are starting this reset. What does financial freedom mean for you spiritually?", type: "reflection", theme: "foundation" },
  { id: "w1d2", week: 1, day: 2, title: "List all income sources", description: "Write every source of income you have, even irregular ones. Acknowledge God as your provider.", type: "action", theme: "foundation" },
  { id: "w1d3", week: 1, day: 3, title: "Pray over your finances", description: "Spend 10 minutes in prayer, surrendering your financial situation to God.", type: "prayer", theme: "foundation" },
  { id: "w1d4", week: 1, day: 4, title: "Track yesterday's spending", description: "Recall and record every expense from the last 2 days. No judgment, just observation.", type: "action", theme: "foundation" },
  { id: "w1d5", week: 1, day: 5, title: "Study Proverbs 21:5", description: "Read and meditate on Proverbs 21:5. Write 3 ways planning relates to your current life.", type: "study", theme: "foundation" },
  { id: "w1d6", week: 1, day: 6, title: "Create your budget draft", description: "Set up your monthly budget categories with planned amounts in the app.", type: "action", theme: "foundation" },
  { id: "w1d7", week: 1, day: 7, title: "Week 1 Reflection", description: "What surprised you this week? What is God showing you about your relationship with money?", type: "reflection", theme: "foundation" },
  // Week 2 – Stewardship
  { id: "w2d1", week: 2, day: 1, title: "Audit your subscriptions", description: "List all recurring subscriptions. Which align with your values? Which can you pause?", type: "action", theme: "stewardship" },
  { id: "w2d2", week: 2, day: 2, title: "The 10% principle", description: "Calculate 10% of your monthly income. Pray and decide your tithe commitment.", type: "prayer", theme: "stewardship" },
  { id: "w2d3", week: 2, day: 3, title: "Meal plan this week", description: "Plan meals to reduce food waste and impulse grocery spending.", type: "action", theme: "stewardship" },
  { id: "w2d4", week: 2, day: 4, title: "Study Luke 16:10-12", description: "Reflect on faithfulness with small things. Where is God asking you to be more faithful?", type: "study", theme: "stewardship" },
  { id: "w2d5", week: 2, day: 5, title: "Log your giving to date", description: "Record any giving you have already done this month in the Giving tracker.", type: "action", theme: "stewardship" },
  { id: "w2d6", week: 2, day: 6, title: "Gratitude inventory", description: "List 10 financial blessings — things you have that you did not earn alone.", type: "reflection", theme: "stewardship" },
  { id: "w2d7", week: 2, day: 7, title: "Week 2 Reflection", description: "How did stewardship show up for you this week? What small win can you celebrate?", type: "reflection", theme: "stewardship" },
  // Week 3 – Debt Awareness
  { id: "w3d1", week: 3, day: 1, title: "List all debts", description: "Write every debt: amount owed, interest rate, minimum payment. Bring it into the light.", type: "action", theme: "debt" },
  { id: "w3d2", week: 3, day: 2, title: "Pray over your debts", description: "Pray specifically over each debt. Ask for wisdom, discipline, and provision.", type: "prayer", theme: "debt" },
  { id: "w3d3", week: 3, day: 3, title: "Research the debt snowball", description: "Learn the debt snowball method. How could you apply it to your situation?", type: "study", theme: "debt" },
  { id: "w3d4", week: 3, day: 4, title: "Find one expense to cut", description: "Identify one non-essential expense this week. Redirect that money toward savings or debt.", type: "action", theme: "debt" },
  { id: "w3d5", week: 3, day: 5, title: "Study Proverbs 22:7", description: "Meditate on 'the borrower is slave to the lender.' How does debt affect your freedom?", type: "study", theme: "debt" },
  { id: "w3d6", week: 3, day: 6, title: "Call one creditor", description: "If applicable, contact one creditor to understand your options or confirm your balance.", type: "action", theme: "debt" },
  { id: "w3d7", week: 3, day: 7, title: "Week 3 Reflection", description: "How do you feel about your debts today vs. Day 1? What shifted in your mindset?", type: "reflection", theme: "debt" },
  // Week 4 – Generosity
  { id: "w4d1", week: 4, day: 1, title: "Define your giving philosophy", description: "Write a personal statement: 'I give because...' Let Scripture guide it.", type: "reflection", theme: "generosity" },
  { id: "w4d2", week: 4, day: 2, title: "Give something today", description: "Give a gift — money, time, or resources — to someone in need today.", type: "action", theme: "generosity" },
  { id: "w4d3", week: 4, day: 3, title: "Study 2 Corinthians 9:6-8", description: "Read the passage on cheerful giving. What does cheerful generosity look like practically?", type: "study", theme: "generosity" },
  { id: "w4d4", week: 4, day: 4, title: "Review your tithe target", description: "Look at your giving tracker. Are you on track with your monthly giving goal?", type: "action", theme: "generosity" },
  { id: "w4d5", week: 4, day: 5, title: "Pray for your church/community", description: "Spend 10 minutes praying for the ministries and communities your giving supports.", type: "prayer", theme: "generosity" },
  { id: "w4d6", week: 4, day: 6, title: "Stretch giving idea", description: "Brainstorm one way to give beyond your tithe this month without straining your budget.", type: "reflection", theme: "generosity" },
  { id: "w4d7", week: 4, day: 7, title: "Week 4 Reflection", description: "How has giving shifted your perspective this week? Did generosity feel like joy or burden?", type: "reflection", theme: "generosity" },
  // Week 5 – Discipline
  { id: "w5d1", week: 5, day: 1, title: "24-hour no-spend challenge", description: "Do not spend any money today except absolute necessities. Notice your triggers.", type: "action", theme: "discipline" },
  { id: "w5d2", week: 5, day: 2, title: "Review last month's transactions", description: "Categorize and review all transactions from last month. Any surprises?", type: "action", theme: "discipline" },
  { id: "w5d3", week: 5, day: 3, title: "Study Philippians 4:11-13", description: "Paul learned contentment. What would learning contentment look like for you financially?", type: "study", theme: "discipline" },
  { id: "w5d4", week: 5, day: 4, title: "Set a savings goal", description: "Define one specific savings goal with a target amount and date. Add it to your prayer goals.", type: "action", theme: "discipline" },
  { id: "w5d5", week: 5, day: 5, title: "Identify your spending triggers", description: "When do you overspend? Stress, boredom, comparison? Journal about your triggers.", type: "reflection", theme: "discipline" },
  { id: "w5d6", week: 5, day: 6, title: "Create a weekly check-in habit", description: "Schedule a 15-minute 'money meeting' with yourself (or spouse) every week.", type: "action", theme: "discipline" },
  { id: "w5d7", week: 5, day: 7, title: "Week 5 Reflection", description: "Where did discipline feel easy? Where was it hard? What do you need from God here?", type: "reflection", theme: "discipline" },
  // Weeks 6-12 condensed (42 more days)
  { id: "w6d1", week: 6, day: 1, title: "Emergency fund check", description: "Do you have 1 month of expenses saved? If not, what is your plan to get there?", type: "action", theme: "provision" },
  { id: "w6d2", week: 6, day: 2, title: "Pray for wisdom in decisions", description: "Bring every upcoming financial decision to God in prayer before acting.", type: "prayer", theme: "provision" },
  { id: "w6d3", week: 6, day: 3, title: "Study Matthew 6:25-34", description: "Read Jesus on worry and provision. What are you anxious about financially?", type: "study", theme: "provision" },
  { id: "w6d4", week: 6, day: 4, title: "Review budget mid-month", description: "Check your budget categories. Are you on track? Adjust if needed.", type: "action", theme: "provision" },
  { id: "w6d5", week: 6, day: 5, title: "Thank God for provision", description: "Journal 5 specific ways God has provided for you financially in the last 6 months.", type: "reflection", theme: "provision" },
  { id: "w6d6", week: 6, day: 6, title: "Accountability check-in", description: "Share your reset journey with someone you trust. Ask them to check in with you.", type: "action", theme: "provision" },
  { id: "w6d7", week: 6, day: 7, title: "Midpoint Celebration!", description: "You are 42 days in. Celebrate your progress. God is working in your finances.", type: "reflection", theme: "provision" },
  { id: "w7d1", week: 7, day: 1, title: "Insurance & protection review", description: "Do you have adequate health, life, and property insurance? Pray for wisdom.", type: "action", theme: "protection" },
  { id: "w7d2", week: 7, day: 2, title: "Pray for financial restoration", description: "Pray specifically about any areas of financial loss, regret, or setback.", type: "prayer", theme: "protection" },
  { id: "w7d3", week: 7, day: 3, title: "Study Proverbs 13:11", description: "Wealth gained hastily dwindles. Journal about patience in your financial journey.", type: "study", theme: "protection" },
  { id: "w7d4", week: 7, day: 4, title: "Review your debt progress", description: "Look at your debt list from Week 3. Any progress? Celebrate even small movement.", type: "action", theme: "protection" },
  { id: "w7d5", week: 7, day: 5, title: "Forgive financial mistakes", description: "Are you holding shame about past financial decisions? Write a prayer of release.", type: "prayer", theme: "protection" },
  { id: "w7d6", week: 7, day: 6, title: "Plan a no-spend weekend", description: "Plan a full weekend with zero optional spending. Discover free joys.", type: "action", theme: "protection" },
  { id: "w7d7", week: 7, day: 7, title: "Week 7 Reflection", description: "What does financial protection mean to you spiritually? How has God been your shield?", type: "reflection", theme: "protection" },
  { id: "w8d1", week: 8, day: 1, title: "Income growth brainstorm", description: "List 3 ways you could legitimately increase income this month. Pray over each one.", type: "action", theme: "growth" },
  { id: "w8d2", week: 8, day: 2, title: "Study the Parable of Talents", description: "Read Matthew 25:14-30. What talent (resource/skill) are you burying instead of investing?", type: "study", theme: "growth" },
  { id: "w8d3", week: 8, day: 3, title: "Skills & gifts inventory", description: "List your top 5 skills or gifts. Which of these could serve others and generate income?", type: "reflection", theme: "growth" },
  { id: "w8d4", week: 8, day: 4, title: "Savings milestone check", description: "How close are you to your savings goal? What one action can you take today?", type: "action", theme: "growth" },
  { id: "w8d5", week: 8, day: 5, title: "Pray for open doors", description: "Pray boldly for God to open income or opportunity doors you cannot create yourself.", type: "prayer", theme: "growth" },
  { id: "w8d6", week: 8, day: 6, title: "Invest in learning", description: "Identify one free or low-cost resource (book, podcast, course) to improve your financial literacy.", type: "action", theme: "growth" },
  { id: "w8d7", week: 8, day: 7, title: "Week 8 Reflection", description: "Where is God calling you to grow financially? Are you willing to be stretched?", type: "reflection", theme: "growth" },
  { id: "w9d1", week: 9, day: 1, title: "Family & legacy conversation", description: "If you have a family, discuss money values with them. What legacy do you want to leave?", type: "reflection", theme: "legacy" },
  { id: "w9d2", week: 9, day: 2, title: "Study Proverbs 13:22", description: "A good person leaves an inheritance. What does legacy giving mean for your situation?", type: "study", theme: "legacy" },
  { id: "w9d3", week: 9, day: 3, title: "Draft a simple will / estate note", description: "Even a simple written record of your wishes is better than none. Start today.", type: "action", theme: "legacy" },
  { id: "w9d4", week: 9, day: 4, title: "Pray for future generations", description: "Pray for your children, grandchildren, or those who will come after you.", type: "prayer", theme: "legacy" },
  { id: "w9d5", week: 9, day: 5, title: "Giving beyond your lifetime", description: "Research one charity or ministry you could include in your long-term giving plan.", type: "action", theme: "legacy" },
  { id: "w9d6", week: 9, day: 6, title: "Values & money alignment check", description: "Do your spending patterns reflect your stated values? Where is there a gap?", type: "reflection", theme: "legacy" },
  { id: "w9d7", week: 9, day: 7, title: "Week 9 Reflection", description: "What does it mean for you to leave a godly financial legacy? What needs to change?", type: "reflection", theme: "legacy" },
  { id: "w10d1", week: 10, day: 1, title: "Celebrate giving wins", description: "Review your giving tracker for the past 3 months. Celebrate every entry as faithfulness.", type: "reflection", theme: "celebration" },
  { id: "w10d2", week: 10, day: 2, title: "Budget mastery check", description: "How many months have you stayed within budget? Reward yourself for progress.", type: "action", theme: "celebration" },
  { id: "w10d3", week: 10, day: 3, title: "Share your story", description: "Write out your faith & finance testimony so far. Who could benefit from hearing it?", type: "reflection", theme: "celebration" },
  { id: "w10d4", week: 10, day: 4, title: "Pray for others on their journey", description: "Pray for 3 people you know who are struggling financially. Ask God how you can help.", type: "prayer", theme: "celebration" },
  { id: "w10d5", week: 10, day: 5, title: "Study Deuteronomy 8:17-18", description: "Do not forget that it is God who gives you power to produce wealth. Reflect on this.", type: "study", theme: "celebration" },
  { id: "w10d6", week: 10, day: 6, title: "Plan a generous act", description: "Plan one meaningful act of generosity for someone outside your immediate circle.", type: "action", theme: "celebration" },
  { id: "w10d7", week: 10, day: 7, title: "Week 10 Reflection", description: "How has your relationship with money changed since Day 1? What is different in your heart?", type: "reflection", theme: "celebration" },
  { id: "w11d1", week: 11, day: 1, title: "Next 90-day preview", description: "What financial goal do you want to tackle in the next 90 days? Set it today.", type: "action", theme: "future" },
  { id: "w11d2", week: 11, day: 2, title: "Accountability structures", description: "What systems will keep you accountable after this reset ends? Write them down.", type: "reflection", theme: "future" },
  { id: "w11d3", week: 11, day: 3, title: "Study Joshua 1:8", description: "Meditate on this book of the law. How does daily renewal apply to your finances?", type: "study", theme: "future" },
  { id: "w11d4", week: 11, day: 4, title: "Annual budget preview", description: "Look ahead at the next 6 months. Are there large expenses to plan for now?", type: "action", theme: "future" },
  { id: "w11d5", week: 11, day: 5, title: "Mentor or discipleship", description: "Identify someone more financially mature than you. How can you learn from them?", type: "reflection", theme: "future" },
  { id: "w11d6", week: 11, day: 6, title: "Pray for sustained discipline", description: "Ask God for the grace to maintain good habits after the reset ends.", type: "prayer", theme: "future" },
  { id: "w11d7", week: 11, day: 7, title: "Week 11 Reflection", description: "What is your vision for your finances 1 year from now? How does faith shape that vision?", type: "reflection", theme: "future" },
  { id: "w12d1", week: 12, day: 1, title: "Final review: budget", description: "Pull your monthly report. How did your actual spending compare to your plan over 90 days?", type: "action", theme: "completion" },
  { id: "w12d2", week: 12, day: 2, title: "Final review: giving", description: "Review your complete giving record. What did faithfulness in giving produce in you?", type: "reflection", theme: "completion" },
  { id: "w12d3", week: 12, day: 3, title: "Final review: prayer goals", description: "Look at your prayer goals. Which were answered? Which are still in progress?", type: "reflection", theme: "completion" },
  { id: "w12d4", week: 12, day: 4, title: "Write your testimony", description: "Write a full 90-day testimony: where you started, what changed, and what God did.", type: "reflection", theme: "completion" },
  { id: "w12d5", week: 12, day: 5, title: "Share your testimony", description: "Share your 90-day story with someone — a friend, your church, or on social media.", type: "action", theme: "completion" },
  { id: "w12d6", week: 12, day: 6, title: "Thanksgiving and worship", description: "Spend 20 minutes in worship and thanksgiving. Your faithfulness matters to God.", type: "prayer", theme: "completion" },
  { id: "w12d7", week: 12, day: 7, title: "Day 90 – You made it!", description: "Congratulations! You completed the Faith & Finance Reset. Now start your next 90 days.", type: "reflection", theme: "completion" },
];
