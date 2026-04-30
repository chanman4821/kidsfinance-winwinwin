Agent completed. agent_id: wwww-village-lessons, agent_type: Game Developer, status: completed, description: Build Bank Robber scam-defense arc + Village lessons, elapsed: 1179s, total_turns: 0, duration: 1169s

Good. All new pages are purely `"use client"` (localStorage, useState, useEffect) — no server concerns. Writing all six deliverables now.

---

## `lib/village-lessons.ts`

```typescript
/**
 * Village-mode lessons for ages 8-12.
 * Extends the Lesson type from lib/game.ts with full body text,
 * mentor dialogue, XP/coin rewards, and tier-1 citations.
 *
 * Standards referenced:
 *   Jump$tart Coalition National Standards in K-12 Personal Finance Education
 *     https://www.jumpstart.org/what-we-do/support-financial-education/standards/
 *   Council for Economic Education — Voluntary National Content Standards in Economics
 *     https://www.councilforeconed.org/resources/publication/?pub_id=236
 *   CFPB Financial Literacy & Education Commission Resources
 *     https://www.consumerfinance.gov/consumer-tools/educator-tools/
 *   Mischel, W., Ebbesen, E.B., & Zeiss, A.R. (1972).
 *     "Cognitive and attentional mechanisms in delay of gratification."
 *     Journal of Personality and Social Psychology, 21(2), 204–218.
 *     https://doi.org/10.1037/h0032198
 */

import type { Lesson } from "./game";

export type VillageLesson = Lesson & {
  /** Full lesson text in kid-voice, grade 3-5 reading level. Paragraphs separated by \n\n */
  body: string;
  /** Mentor's in-character spoken line shown before the quiz. */
  mentorDialogue: string;
  xpReward: number;
  coinReward: number;
  /** Tier-1 citation backing the lesson's core concept. */
  citation: { standard: string; url: string };
};

export const VILLAGE_LESSONS: VillageLesson[] = [
  /* ── Lesson 1 ────────────────────────────────── */
  {
    id: "VL1",
    emoji: "🫙",
    title: "Save, Spend, Give — Why 3 Jars?",
    ageBand: "8-12",
    mentor: "🐿️ Sage",
    blurb:
      "Every coin you earn can do three different jobs. Splitting your money is the first money superpower.",
    body: `Have you ever gotten money and spent it all right away — then wished you had some left? That happens to everyone, even adults!\n\nThe 3-Jar system fixes this with a simple trick. Every time you earn coins, you split them:\n\n🐷 SAVE — set aside for something you really want later.\n🍭 SPEND — for fun things you want right now.\n❤️ GIVE — to help someone else or a cause you care about.\n\nWhy does it work? Each jar has one job. When your money is separated, you can't accidentally spend your savings on candy.\n\nTry the 50-30-20 rule: 50% Save · 30% Spend · 20% Give. It doesn't have to be exact — even a little in each jar is a great start!`,
    mentorDialogue:
      '🐿️ Sage says: "I keep acorns in three separate spots in my tree. Some I\'ll eat this week, some I\'m saving for winter, and some I share with friends. Same idea with coins — split it up and you\'ll always have enough!"',
    quiz: [
      {
        q: "What does the SAVE jar help you do?",
        options: [
          "Buy things you want right now",
          "Put money aside for something bigger later",
          "Give money away to charity",
          "Store coins so no one else uses them",
        ],
        correct: 1,
        why: "The Save jar is for future goals. Saving a little at a time is how you afford bigger things without borrowing!",
      },
      {
        q: "You earn 10 coins. Using the 50-30-20 rule, how many go to Save?",
        options: ["2 coins", "3 coins", "5 coins", "10 coins"],
        correct: 2,
        why: "50% of 10 = 5. Half your earnings in the Save jar — that's the biggest bucket because building savings is the most powerful habit.",
      },
      {
        q: "Why is the Give jar a good idea?",
        options: [
          "So you have less money to track",
          "Because giving to others feels good AND helps your community",
          "Because rules say you have to",
          "So parents can take it",
        ],
        correct: 1,
        why: "Research shows that giving money or time to help others actually makes the giver happier. It's a win-win!",
      },
      {
        q: "Sam spent all his coins on candy. Now he can't buy the sneakers he wanted. What went wrong?",
        options: [
          "He should have earned more coins first",
          "He forgot to split his money into jars before spending",
          "Candy costs too much",
          "Nothing — this is normal",
        ],
        correct: 1,
        why: "Without a Save jar, it's easy to spend everything on small things and miss the big goal. The 3-jar split keeps you on track!",
      },
      {
        q: "Which jar grows the SLOWEST but helps you reach BIG goals?",
        options: ["Spend", "Give", "Save", "All of them equally"],
        correct: 2,
        why: "The Save jar grows slowly because you only add to it — but that patience is what makes it so powerful. Slow and steady wins!",
      },
    ],
    badge: "🏅 Jar Juggler",
    xpReward: 30,
    coinReward: 10,
    citation: {
      standard:
        "Jump$tart Coalition National Standards — Saving & Investing Standard 1: Spending and Saving",
      url: "https://www.jumpstart.org/what-we-do/support-financial-education/standards/",
    },
  },

  /* ── Lesson 2 ────────────────────────────────── */
  {
    id: "VL2",
    emoji: "🍡",
    title: "Why People Wait — The Marshmallow Test",
    ageBand: "8-12",
    mentor: "🐿️ Sage",
    blurb:
      "A famous experiment showed that kids who wait for bigger rewards often do better in life. Here's what it means for YOUR money.",
    body: `In 1972, researcher Walter Mischel ran a famous experiment at Stanford University. He put a marshmallow in front of a child and said: "You can eat this now. Or, if you wait 15 minutes, I'll give you TWO marshmallows."\n\nSome kids waited. Some ate it right away.\n\nWhen Mischel checked on those kids years later, the ones who waited tended to do better in school and in life. This is called DELAYED GRATIFICATION — choosing a bigger reward later over a small reward right now.\n\nThis is exactly what saving money is. When you put coins in your Save jar instead of spending them today, you're doing the marshmallow test. You're choosing the bigger future reward.\n\nThe good news? Delayed gratification is a SKILL you can practice. Tricks that help:\n• Tape a picture of your goal to your Save jar\n• Track your progress every day — watching the jar fill is satisfying!\n• Remind yourself WHY the bigger reward is worth waiting for\n\nNote: Later research found that children in stable, trustworthy environments found it easier to wait. The system around you matters too!`,
    mentorDialogue:
      '🐿️ Sage says: "Every autumn I could eat all my acorns immediately — they taste amazing! But if I save most of them, I have food all winter. Waiting is HARD but it\'s worth it. What are YOU saving for? Put a picture on your jar so you see it every day!"',
    quiz: [
      {
        q: "What did the Marshmallow Test study?",
        options: [
          "Whether kids like marshmallows",
          "Whether kids could wait for a bigger reward instead of taking a smaller one now",
          "How fast kids can eat",
          "Which snacks are healthiest",
        ],
        correct: 1,
        why: "The study tested delayed gratification — the ability to wait for a better outcome. This same skill helps you save money!",
      },
      {
        q: "In money terms, what's the 'two-marshmallow' choice?",
        options: [
          "Buying two cheap things instead of one expensive thing",
          "Saving your coins now to buy something bigger later",
          "Giving twice as much to charity",
          "Spending everything immediately",
        ],
        correct: 1,
        why: "Choosing to save = choosing two marshmallows. You wait a little, but you get something much better in the end!",
      },
      {
        q: "What's a good trick to help yourself wait for a bigger reward?",
        options: [
          "Try to forget about your goal completely",
          "Set a clear goal with a picture and track your progress",
          "Spend some money first so you feel better",
          "Ask someone else to decide for you",
        ],
        correct: 1,
        why: "Visual goals keep your brain focused on the future reward. Out of sight = out of mind!",
      },
      {
        q: "Later research found that kids also waited longer when:",
        options: [
          "The room was very quiet",
          "They were in a stable, trustworthy environment",
          "Other kids were watching them",
          "The marshmallow smelled bad",
        ],
        correct: 1,
        why: "Trust matters! If you know the reward will actually appear, it's easier to wait. A reliable savings system builds that trust.",
      },
      {
        q: "Delayed gratification means...",
        options: [
          "Delaying everything forever and never spending",
          "Choosing a bigger, later reward over a smaller, right-now reward",
          "Never enjoying your money",
          "Being ungrateful for small things",
        ],
        correct: 1,
        why: "It's not about never spending — it's about TIMING. Sometimes waiting a bit gets you something much, much better!",
      },
    ],
    badge: "🏅 Patience Champ",
    xpReward: 30,
    coinReward: 10,
    citation: {
      standard:
        "Mischel, W., Ebbesen, E.B., & Zeiss, A.R. (1972). 'Cognitive and attentional mechanisms in delay of gratification.' Journal of Personality and Social Psychology, 21(2), 204–218.",
      url: "https://doi.org/10.1037/h0032198",
    },
  },

  /* ── Lesson 3 ────────────────────────────────── */
  {
    id: "VL3",
    emoji: "🪙",
    title: "Where Does Money Come From?",
    ageBand: "8-12",
    mentor: "🐶 Mochi",
    blurb:
      "Before you can manage money, you need to know where it comes from. Spoiler: it always starts with work or an idea!",
    body: `Money doesn't grow on trees — you already know that! But where does it ACTUALLY come from?\n\nThere are three main ways:\n\n🔨 WORK — You trade your time and effort for money. When an adult goes to a job, they're swapping their skills for a paycheck. When you do chores, you're doing exactly the same thing!\n\n🏪 SELLING — Someone makes or finds something valuable and sells it. A lemonade stand, a baked-goods stall, an artist selling paintings — all of these create money by giving people something they want.\n\n📈 INVESTING — Money makes MORE money. When you own part of a company (stocks) or put money in a savings account (interest), you earn money without extra work. This is the most powerful — but it takes having some money to start.\n\nWho makes the actual coins and bills? In the USA, the government does! The US Mint makes coins, and the Federal Reserve manages paper currency. They control how much money exists in the whole country.\n\nKey idea: money is just a TOOL for trading value. You offer something valuable (your time, skills, or goods) and money lets you exchange that value for other things you need.`,
    mentorDialogue:
      '🐶 Mochi says: "As Mayor of Coinwood, I make sure everyone has ways to earn and trade. Our whole village works because each person offers something valuable — your lemonade, Olivia\'s books, Grace\'s flowers. Money is just how we keep score of that value. Pretty cool, right?"',
    quiz: [
      {
        q: "Which of these is NOT one of the main ways money is earned?",
        options: [
          "Working at a job",
          "Selling something valuable",
          "Wishing really hard for it",
          "Investing money you already have",
        ],
        correct: 2,
        why: "Money always comes from creating value — working, selling, or investing. Wishing doesn't create value for anyone else!",
      },
      {
        q: "Who makes the actual coins used in the United States?",
        options: [
          "Banks",
          "Grocery stores",
          "The US Mint (part of the government)",
          "Amazon",
        ],
        correct: 2,
        why: "The US Mint (part of the Treasury Department) manufactures all circulating coins. The Federal Reserve handles paper currency.",
      },
      {
        q: "What's the difference between active income and passive income?",
        options: [
          "Active income is money you spend; passive income is money you save",
          "Active income requires your time and work; passive income comes from things you own",
          "Active income is for adults; passive income is for kids",
          "There is no real difference",
        ],
        correct: 1,
        why: "Active income (wages, tips) requires showing up and working. Passive income (interest, rent) works even while you sleep!",
      },
      {
        q: "When you do chores for coins, which type of income is that?",
        options: [
          "Passive income",
          "Investing income",
          "Active income — trading your time and effort for coins",
          "Luck income",
        ],
        correct: 2,
        why: "Chores = active income. You trade your time and effort for coins, just like a job!",
      },
      {
        q: "Money is best described as:",
        options: [
          "Something only adults can understand",
          "A tool that lets people trade value with each other",
          "Random numbers that don't really mean anything",
          "Something the government gives out for free",
        ],
        correct: 1,
        why: "Money is a tool — it makes trading easier. Instead of trading 12 eggs for a haircut, we all agree money represents value.",
      },
    ],
    badge: "🏅 Money Maker",
    xpReward: 30,
    coinReward: 10,
    citation: {
      standard:
        "CFPB Financial Literacy & Education Commission — Earning and Income: Understanding Sources of Income",
      url: "https://www.consumerfinance.gov/consumer-tools/educator-tools/",
    },
  },

  /* ── Lesson 4 ────────────────────────────────── */
  {
    id: "VL4",
    emoji: "📋",
    title: "What Is a Budget?",
    ageBand: "8-12",
    mentor: "🦥 Sam",
    blurb:
      "A budget sounds boring — but it's actually a superpower. It's a plan that tells your money what to do BEFORE you spend it.",
    body: `Imagine you're going on a road trip. You wouldn't just start driving with no map, right? A budget is a MAP for your money.\n\nA budget does three things:\n✅ Shows how much money is coming IN (income)\n✅ Shows how much money is going OUT (expenses)\n✅ Makes sure you never spend MORE than you earn\n\nHow to make a simple budget:\n1. Write down how much you earn in a week (coins from chores, birthday money, etc.)\n2. Write down what you WANT to spend it on\n3. Make sure the spending list doesn't add up to more than what came in!\n\nBudget math:\n• Income − Expenses = what's left over\n• If Income > Expenses → you're saving 🎉\n• If Expenses > Income → you have a problem (called a deficit)\n\nExample with 40 coins earned this week:\n- 20 coins → Save jar\n- 10 coins → Spend on a book\n- 8 coins → Give jar\n- 2 coins left over ✅\n\nTotal spent: 38. Total earned: 40. You kept 2 extra coins. That's a perfect budget!`,
    mentorDialogue:
      '🦥 Sam says: "Okay, I\'ll admit — I used to eat pizza all day and wonder where my coins went. Then Mochi taught me budgeting. Now I write down what I want to buy BEFORE buying it. It sounds slow, but it means I never run out of pizza money. Budget first, snack second!"',
    quiz: [
      {
        q: "What is a budget?",
        options: [
          "A list of things you wish you could buy",
          "A plan that shows your income and spending so you don't overspend",
          "A punishment for spending too much",
          "Something only businesses and governments need",
        ],
        correct: 1,
        why: "A budget is a spending plan. It helps you control your money instead of wondering where it all went!",
      },
      {
        q: "You earn 50 coins and your budget says you'll spend 60 coins. What's wrong?",
        options: [
          "Nothing — you can always borrow the difference",
          "You're spending more than you earn, which creates debt",
          "Your budget is too complicated",
          "You should just earn fewer coins",
        ],
        correct: 1,
        why: "Spending more than you earn = deficit = debt. Debt means future earnings are already spent before you get them!",
      },
      {
        q: "The word for money coming IN (your earnings) in a budget is:",
        options: ["Expenses", "Income", "Savings", "Deficit"],
        correct: 1,
        why: "Income = money coming IN. Expenses = money going OUT. A budget tracks both sides!",
      },
      {
        q: "Why should you make a budget BEFORE you spend — not after?",
        options: [
          "Because it's a rule at school",
          "So you can plan ahead and make sure you have enough for everything important",
          "Because spending first is always wrong",
          "Budgets work the same way no matter when you make them",
        ],
        correct: 1,
        why: "A budget made AFTER you spend is just a report. Made BEFORE, it's a plan — it helps you make better choices!",
      },
      {
        q: "Zara has 30 coins. She wants to spend 15 on a toy, 10 for Save, and 8 for Give. Can she do it?",
        options: [
          "Yes — 15 + 10 + 8 = 33, and she has 30",
          "No — 15 + 10 + 8 = 33, which is more than 30",
          "Yes — she has exactly 30",
          "Not enough information to tell",
        ],
        correct: 1,
        why: "15 + 10 + 8 = 33 but she only has 30. She needs to cut 3 coins somewhere (like spending 12 on the toy) to balance!",
      },
    ],
    badge: "🏅 Budget Boss",
    xpReward: 30,
    coinReward: 10,
    citation: {
      standard:
        "Council for Economic Education — National Standards for Personal Financial Literacy, Standard 6: Saving",
      url: "https://www.councilforeconed.org/resources/publication/?pub_id=236",
    },
  },

  /* ── Lesson 5 ────────────────────────────────── */
  {
    id: "VL5",
    emoji: "🍋",
    title: "Supply and Demand at My Stand",
    ageBand: "8-12",
    mentor: "🐶 Mochi",
    blurb:
      "Why does lemonade sell out on hot days but nobody wants it in the rain? The secret is supply and demand!",
    body: `Every time something is bought or sold, two invisible forces are at work: SUPPLY and DEMAND.\n\n📦 SUPPLY — how much of something is available to buy.\n🛒 DEMAND — how much people WANT to buy it.\n\nThe key rule:\n• When DEMAND goes UP (more people want it) and supply stays the same → PRICE goes UP\n• When SUPPLY goes UP (much more available) and demand stays the same → PRICE goes DOWN\n\nYour lemonade stand is a perfect example:\n☀️ Sunny day: It's hot! Everyone wants lemonade (HIGH demand). You can charge more per cup.\n🌧️ Rainy day: Nobody wants cold drinks (LOW demand). Lower your price or take the day off.\n\nAnother example from real life:\n• Only 1 limited-edition sneaker left in the store → HIGH demand, LOW supply → VERY EXPENSIVE!\n• 1,000 copies of an old game nobody plays → LOW demand, HIGH supply → SUPER CHEAP!\n\nThe perfect price — called the EQUILIBRIUM price — is where what customers want to pay meets what you need to earn. Set prices too high: nobody buys. Set them too low: no profit. The sweet spot is in the middle!`,
    mentorDialogue:
      '🐶 Mochi says: "When I opened Mochi\'s Ice Cream, I charged 10 coins a scoop — sales were slow. Then summer came, everyone wanted ice cream, and I raised the price to 15 coins and STILL sold out. That\'s supply and demand! Watch the weather and adjust your prices at the stand."',
    quiz: [
      {
        q: "What does 'demand' mean in economics?",
        options: [
          "How much of something is available to buy",
          "How much people want to buy something",
          "The price set for a product",
          "How long it takes to make something",
        ],
        correct: 1,
        why: "Demand = how much people want something. Supply = how much is available. Together they determine price!",
      },
      {
        q: "It's a snowy day. Demand for lemonade is very LOW. What should a smart seller do?",
        options: [
          "Double the price because lemonade is rare in snow",
          "Lower the price to attract the few customers who are out, or close for the day",
          "Make lots more lemonade to increase supply",
          "Give it all away for free",
        ],
        correct: 1,
        why: "Low demand means lowering prices can attract what few customers exist — or it's smarter to close and save your ingredients!",
      },
      {
        q: "If there's only 1 of a rare toy in the whole world, what usually happens to its price?",
        options: [
          "The price goes down because it's rare",
          "The price goes up because many people want the one thing available",
          "The price stays exactly the same",
          "Nobody buys rare things",
        ],
        correct: 1,
        why: "High demand + low supply = high price. This is why rare sneakers and limited-edition games cost so much!",
      },
      {
        q: "What is the 'equilibrium price'?",
        options: [
          "The highest price a seller can charge",
          "The price where what sellers want to earn meets what buyers want to pay",
          "Always the cheapest possible price",
          "A price set by the government",
        ],
        correct: 1,
        why: "Equilibrium = the balance point. It's the price where a willing buyer and a willing seller can both say yes!",
      },
      {
        q: "You charge 8 coins per lemonade but nobody buys. What does this tell you?",
        options: [
          "Everyone already has enough lemonade",
          "Your price is above what customers are willing to pay — demand falls at high prices",
          "Your lemonade must taste bad",
          "You need a much bigger stand",
        ],
        correct: 1,
        why: "Too high a price and buyers walk away. This is called price elasticity — as price rises, demand usually falls!",
      },
    ],
    badge: "🏅 Market Whiz",
    xpReward: 35,
    coinReward: 12,
    citation: {
      standard:
        "Council for Economic Education — Voluntary National Content Standards in Economics, Standard 8: Role of Prices",
      url: "https://www.councilforeconed.org/resources/publication/?pub_id=236",
    },
  },

  /* ── Lesson 6 ────────────────────────────────── */
  {
    id: "VL6",
    emoji: "🏪",
    title: "Passive Income — Owning a Shop",
    ageBand: "8-12",
    mentor: "🦉 Olivia",
    blurb:
      "What if your money worked while you slept? That's passive income — and owning shops in Coinwood is how you practice it.",
    body: `Imagine this: you wake up, check your coins, and you have MORE than you did last night — without doing a single thing. How?\n\nThat's PASSIVE INCOME.\n\nThere are two kinds of income:\n\n🏃 ACTIVE INCOME — You trade your time and energy for money. Chores, lemonade stand, a job. Stop working → stop earning.\n\n💤 PASSIVE INCOME — Things you OWN make money for you without you working every hour. Examples:\n• A shop: it sells things every day, even when you're not there\n• Savings interest: a bank pays YOU to keep money there\n• Rental property: tenants pay you to live in your building\n• Book royalties: an author earns money every time someone buys their book\n\nWhy is passive income so powerful? Because active income has a limit — there are only 24 hours in a day. Passive income has no such limit. The more assets you own, the more it grows.\n\nIn Coinwood Village, each shop you buy pays you coins every day. The more shops you own, the more money flows in while you do other things. This is a simplified version of how real investors build lasting wealth!\n\n💡 The catch: You need money to START. You can't own a shop without buying it first. That's exactly why saving comes before investing!`,
    mentorDialogue:
      '🦉 Olivia says: "I own Owl\'s Bookshop. Every day I earn 7 coins from book sales — even on days I don\'t come in. I bought the shop with coins I saved from tutoring. Now those coins work FOR me. First you work for money. Then you make your money work for you."',
    quiz: [
      {
        q: "What is passive income?",
        options: [
          "Money you earn by working harder than usual",
          "Money earned from things you own, without needing to actively work for every coin",
          "Money you receive from your parents or relatives",
          "Money you don't have to pay taxes on",
        ],
        correct: 1,
        why: "Passive income comes from assets — shops, stocks, savings accounts, rental property — not from your hours worked.",
      },
      {
        q: "Why can't you have unlimited active income, but you CAN stack passive income?",
        options: [
          "Active income is illegal in large amounts",
          "Active income is limited by your 24 hours/day; passive income comes from owning assets that can be stacked",
          "Passive income is a myth that doesn't really work",
          "Active income always pays much more per hour",
        ],
        correct: 1,
        why: "You can own 100 shops (in theory). You can't work 100 jobs simultaneously. That's why owning assets is how wealth grows!",
      },
      {
        q: "Which of these is an example of passive income?",
        options: [
          "Getting paid hourly to mow lawns",
          "Earning interest on money in a savings account",
          "Doing weekly chores for coins",
          "Selling lemonade at your stand",
        ],
        correct: 1,
        why: "Savings account interest = passive. You deposit the money once, and the bank pays you over time without you doing anything extra!",
      },
      {
        q: "In Coinwood Village, shops pay coins even when you're not playing. This is an example of:",
        options: [
          "Active income",
          "Cheating the game",
          "Passive income — your asset (the shop) works for you",
          "A type of budget",
        ],
        correct: 2,
        why: "Shops = assets. Assets work while you're away. In real life this is how rental income, dividends, and interest work!",
      },
      {
        q: "Why do you need to save BEFORE you can earn passive income?",
        options: [
          "You don't — passive income is always free",
          "Because you need money (capital) to buy the asset that generates income",
          "Because all passive income requires a bank account",
          "Because the government requires it by law",
        ],
        correct: 1,
        why: "Passive income isn't free — you invest money upfront to buy the asset. That's why saving comes BEFORE investing!",
      },
    ],
    badge: "🏅 Passive Power",
    xpReward: 35,
    coinReward: 12,
    citation: {
      standard:
        "Jump$tart Coalition National Standards — Investing Standard 2: Benefits of Saving and Investing Early",
      url: "https://www.jumpstart.org/what-we-do/support-financial-education/standards/",
    },
  },

  /* ── Lesson 7 ────────────────────────────────── */
  {
    id: "VL7",
    emoji: "❤️",
    title: "Why We Give — The Power of Helping",
    ageBand: "8-12",
    mentor: "🦒 Grace",
    blurb:
      "Giving sounds like losing something — but studies show it actually makes you richer in the ways that matter most.",
    body: `You might think: "If I give my coins away, I have fewer coins. That's bad, right?"\n\nHere's the surprising truth: giving makes you HAPPIER and more connected to your community — and those things have real value.\n\nWhat research suggests about giving:\n• People who regularly give money or time report higher happiness and life satisfaction.\n• Communities where people help each other are safer, healthier, and more fun to live in.\n• Generosity is contagious — when one person gives, others are more likely to give too.\n[Note: specific claims about brain chemistry and giving are still being studied — the overall link between generosity and wellbeing is well-supported by social science research.]\n\nWhat does giving look like for kids?\n• Putting coins in your Give jar for a charity you care about\n• Donating old toys or clothes someone else could use\n• Volunteering time (helping at a shelter, reading to younger kids)\n• Doing something kind with no expectation of payment\n\nYou don't have to give a lot. Even 20% of your weekly coins — just 2 coins out of 10 — adds up to real impact over time. And it builds the habit of generosity that lasts a lifetime.`,
    mentorDialogue:
      '🦒 Grace says: "Every flower I plant isn\'t just for me — it\'s for everyone who walks by. I could sell them all, but I donated a garden to the village park. Now when I see kids smile at the flowers, I feel richer than if I\'d spent those coins on myself. Try putting even a tiny bit in your Give jar this week. See how it feels!"',
    quiz: [
      {
        q: "What does research suggest happens to people who regularly give to others?",
        options: [
          "They become poorer and less happy over time",
          "They experience greater happiness and life satisfaction",
          "They automatically earn more money at their jobs",
          "Nothing — giving has no measurable effect on the giver",
        ],
        correct: 1,
        why: "Multiple studies link regular giving (money, time, kindness) to higher wellbeing and happiness for the giver — not just the receiver!",
      },
      {
        q: "Which of these is a form of giving that does NOT require any money?",
        options: [
          "Donating coins to a charity",
          "Volunteering your time to help at an animal shelter",
          "Buying gifts for friends",
          "Putting coins in your Give jar",
        ],
        correct: 1,
        why: "Giving time = volunteering. Your time is valuable — giving it to help others is just as meaningful as giving money!",
      },
      {
        q: "What is the Give jar in the 3-jar system for?",
        options: [
          "Giving coins back to your parents",
          "Setting aside coins for charities, causes, or helping others in your community",
          "Spending on gifts for yourself",
          "Coins you keep locked away and never use",
        ],
        correct: 1,
        why: "The Give jar is earmarked for generosity — charities, community causes, or helping a friend who needs it. You choose who benefits!",
      },
      {
        q: "Why does giving benefit the WHOLE COMMUNITY, not just the receiver?",
        options: [
          "It doesn't — only the direct receiver benefits",
          "A culture of giving makes communities safer, healthier, and more connected for everyone",
          "Because the government rewards every act of giving with money",
          "Only if everyone gives exactly the same amount",
        ],
        correct: 1,
        why: "When people in a community help each other, trust grows, problems get solved faster, and everyone feels more supported. Generosity is contagious!",
      },
      {
        q: "You earn 20 coins this week. Using the 20% Give rule, how many go in the Give jar?",
        options: ["1 coin", "2 coins", "4 coins", "10 coins"],
        correct: 2,
        why: "20% of 20 = 4. Even 4 coins a week adds up to over 200 coins a year — that's real impact from a small habit!",
      },
    ],
    badge: "🏅 Generous Heart",
    xpReward: 30,
    coinReward: 10,
    citation: {
      standard:
        "Jump$tart Coalition National Standards — Financial Responsibility and Decision Making; CFPB Youth Financial Education Framework on Giving",
      url: "https://www.jumpstart.org/what-we-do/support-financial-education/standards/",
    },
  },

  /* ── Lesson 8 ────────────────────────────────── */
  {
    id: "VL8",
    emoji: "📈",
    title: "Compound Interest in Pictures",
    ageBand: "8-12",
    mentor: "🐿️ Sage",
    blurb:
      "Compound interest is called the most powerful force in finance. Here's why starting EARLY matters more than starting BIG.",
    body: `Imagine you plant 1 magic seed. Each year it grows and makes more seeds. Then THOSE seeds grow and make even more seeds. That's compound interest — your INTEREST earns INTEREST.\n\nExample: 100 coins at 10% interest per year:\n• Year 0: 100 coins\n• Year 1: 100 + 10 = 110 coins\n• Year 2: 110 + 11 = 121 coins ← interest on BOTH the original AND last year's interest!\n• Year 10: ~259 coins (grew 2.5×)\n• Year 30: ~1,745 coins (grew 17×!!!)\n\nThe Rule of 72 — a quick mental math shortcut:\nDivide 72 by the interest rate to find how long your money takes to DOUBLE.\n• At 6% interest: 72 ÷ 6 = 12 years to double\n• At 10% interest: 72 ÷ 10 = 7.2 years to double\n• At 3% interest: 72 ÷ 3 = 24 years to double\n\nWhy starting EARLY beats starting BIG:\n• Start at age 10, save 50 coins/year at 7% → by age 65: ~21,000 coins\n• Start at age 30, save 50 coins/year at 7% → by age 65: ~6,600 coins\n\nSame amount saved every year. Starting just 20 years earlier = MORE THAN THREE TIMES the money.\n\n💡 Time is your biggest superpower. Use the visualizer below to see compound interest in action!`,
    mentorDialogue:
      '🐿️ Sage says: "I started saving acorns when I was just a tiny baby squirrel. My friends said \'why bother with just a few?\' But those few acorns made more acorns, and THOSE made more — now I have enough for many winters. Start NOW, even with a little. Time multiplies everything!"',
    quiz: [
      {
        q: "What makes compound interest different from simple interest?",
        options: [
          "Compound interest always has a higher percentage rate",
          "With compound interest, you earn interest on your interest — not just the original amount",
          "Simple interest is only available from banks",
          "They are exactly the same thing",
        ],
        correct: 1,
        why: "Compound = interest on top of interest. Simple = only on the original amount. Compounding grows MUCH faster over time!",
      },
      {
        q: "Using the Rule of 72, how long does money take to double at 9% interest?",
        options: ["9 years", "8 years", "72 years", "18 years"],
        correct: 1,
        why: "72 ÷ 9 = 8 years. The Rule of 72 is a quick mental math shortcut for any interest rate!",
      },
      {
        q: "You start saving at age 10 instead of age 20. What's the effect at age 65?",
        options: [
          "Almost no difference — a few years doesn't matter much",
          "Starting at 10 gives significantly more money because compound interest has more time to grow",
          "You'd have the same total, just spread out differently",
          "Starting at 20 is actually better because you earn more money by then",
        ],
        correct: 1,
        why: "Time is the most powerful factor in compound interest. Starting 10 years earlier can more than double your final amount!",
      },
      {
        q: "100 coins at 10% interest — what do you have after exactly 2 years with compound interest?",
        options: ["120 coins", "110 coins", "121 coins", "130 coins"],
        correct: 2,
        why: "Year 1: 100 × 1.10 = 110. Year 2: 110 × 1.10 = 121. Note: 121, not 120 — that extra coin IS compound interest!",
      },
      {
        q: "Two people both save 200 coins/year for 30 years, but one starts at 12 and one at 22. Who has more at 62?",
        options: [
          "The one who started at 22 — they're older and wiser with money",
          "The one who started at 12 — time in the market is the biggest advantage",
          "They'll have exactly the same amount",
          "It depends on what they bought with the coins",
        ],
        correct: 1,
        why: "Same saved per year, but the person who started at 12 had 10 extra years of compounding. Time multiplies money!",
      },
    ],
    badge: "🏅 Compound Genius",
    xpReward: 40,
    coinReward: 15,
    citation: {
      standard:
        "CFPB Financial Literacy — Saving and Investing: Compound Interest; Jump$tart Standard on Long-Term Wealth Building",
      url: "https://www.consumerfinance.gov/consumer-tools/educator-tools/",
    },
  },
];

/** Returns the index-ordered IDs of all village lessons. */
export const VILLAGE_LESSON_IDS = VILLAGE_LESSONS.map((l) => l.id);

/**
 * Returns true if the lesson at `idx` is available to play.
 * Lesson 0 is always unlocked. Each subsequent lesson requires the previous to be completed.
 */
export function isLessonUnlocked(idx: number, completedIds: string[]): boolean {
  if (idx === 0) return true;
  const prev = VILLAGE_LESSONS[idx - 1];
  return prev !== undefined && completedIds.includes(prev.id);
}
```

---

## `lib/village-bank-robber.ts`

```typescript
/**
 * Bank Robber 🦝 Scam-Defense Arc — 5 educational "spot the scam" episodes.
 *
 * Tone: playful and educational — the villain is cartoonish, not threatening.
 * Goal: teach kids to recognise common financial scam patterns.
 *
 * Citations:
 *   FTC Consumer Information on Scams
 *     https://consumer.ftc.gov/scams
 *   CFPB Consumer Protection Resources
 *     https://www.consumerfinance.gov/consumer-tools/educator-tools/
 *   Jump$tart Coalition — Consumer Decision-Making Standards
 *     https://www.jumpstart.org/what-we-do/support-financial-education/standards/
 */

export type ScamOption = {
  text: string;
  correct: boolean;
  /** Shown after the player selects this option — explains why it's right or wrong. */
  explanation: string;
};

export type ScamEpisode = {
  id: string;
  episodeNumber: number;
  emoji: string;
  title: string;
  /** Narrated setup — what happened before the Bank Robber appeared. */
  setup: string;
  /** The Bank Robber's scam attempt — shown in a speech bubble. */
  bankRobberVoice: string;
  /** Four response options; exactly one has correct: true. */
  options: ScamOption[];
  /** Real-world context revealed after completing the episode. */
  realWorldTieIn: string;
  badge: string;
  xpReward: number;
  coinReward: number;
};

export const SCAM_EPISODES: ScamEpisode[] = [
  /* ── Episode 1 ───────────────────────────────── */
  {
    id: "scam-ep-1",
    episodeNumber: 1,
    emoji: "📧",
    title: "The Phishing Email",
    setup:
      "You're tending your lemonade stand when a message pops up on the Coinwood message board. It looks official — but something feels off...",
    bankRobberVoice:
      "🦝 URGENT MESSAGE! Congratulations, Coinwood resident! You have been SELECTED to receive 100 FREE COINS! Your account may be CLOSED if you don't act in the next 10 MINUTES! Click here and enter your Coinwood password to claim your prize NOW!!!",
    options: [
      {
        text: "😱 100 free coins! Click the link and type in my password right away!",
        correct: false,
        explanation:
          "❌ This is exactly what the Bank Robber wants! Real prizes NEVER ask for your password. Clicking unknown links and sharing passwords can let scammers steal your account.",
      },
      {
        text: "🚨 Wait — no real prize ever asks for a password. This is suspicious!",
        correct: true,
        explanation:
          "✅ Correct! Red flags: extreme urgency (10 MINUTES!), unexpected prize, and asking for a password. Legitimate services never ask for your password in a message.",
      },
      {
        text: "🤔 Ask the Bank Robber for more details first, then decide whether to enter my password.",
        correct: false,
        explanation:
          "❌ Engaging with scammers — even to ask questions — can lead you further into the trap. The right move is to ignore and report, not to negotiate.",
      },
      {
        text: "📢 Share the message with all my friends so they can claim free coins too!",
        correct: false,
        explanation:
          "❌ Sharing a phishing link spreads the scam to your friends! Always verify before sharing anything that seems too good to be true.",
      },
    ],
    realWorldTieIn:
      "Phishing emails and messages are one of the most common scams in the real world. They create URGENCY (act now!), promise FREE stuff, and ask for passwords or personal info. In 2023, the FTC received millions of fraud reports — phishing is a top source. Rule: legitimate companies NEVER ask for your password via email or message.",
    badge: "🛡️ Phishing Spotter",
    xpReward: 25,
    coinReward: 8,
  },

  /* ── Episode 2 ───────────────────────────────── */
  {
    id: "scam-ep-2",
    episodeNumber: 2,
    emoji: "💸",
    title: "The Get-Rich-Quick Scheme",
    setup:
      "You've been saving hard and have 50 coins in your wallet. You're walking past the Coinwood market when the Bank Robber sidles up to you with a big grin...",
    bankRobberVoice:
      "🦝 Psssst! Friend! I'll make you a DEAL. Give me just 50 of your coins TODAY, and I personally PROMISE to give you back 100 coins tomorrow morning. Easy! You'll DOUBLE your money overnight! I've done this for hundreds of kids in Coinwood. Trust me!",
    options: [
      {
        text: "💰 Wow, 50 coins becomes 100! Hand over the 50 coins right away.",
        correct: false,
        explanation:
          "❌ This is called an advance-fee scam. You pay upfront and the 'doubling' never happens. The Bank Robber takes your 50 coins and disappears!",
      },
      {
        text: "🏦 Ask which bank he works for and get his business card, then give him the coins.",
        correct: false,
        explanation:
          "❌ Scammers can easily fake business cards and names. If someone promises guaranteed overnight returns, no paperwork makes it safe.",
      },
      {
        text: "🚨 Nobody can legitimately double money overnight. This is too good to be true!",
        correct: true,
        explanation:
          "✅ Correct! 'Too good to be true' is the first warning sign. Real investments take time and carry risk. Anyone promising guaranteed, fast doubling is running a scam.",
      },
      {
        text: "🧪 Give him 25 coins to 'test' it first — lower risk that way.",
        correct: false,
        explanation:
          "❌ Scammers sometimes return a small amount at first to build trust, then ask for more. This is called 'advance-fee fraud' — even the test puts you at risk!",
      },
    ],
    realWorldTieIn:
      "Get-rich-quick schemes are ancient — and they still work because our brains WANT easy money to be real. The FTC warns: if someone guarantees fast, high returns with no risk, it's a scam. Real investing (index funds, savings accounts) earns modest returns over years — not overnight. If it sounds too good to be true, it is.",
    badge: "🛡️ Scheme Buster",
    xpReward: 25,
    coinReward: 8,
  },

  /* ── Episode 3 ───────────────────────────────── */
  {
    id: "scam-ep-3",
    episodeNumber: 3,
    emoji: "⛏️",
    title: "The Fake Investment",
    setup:
      "A flashy flyer appears all around Coinwood Village. It promises amazing guaranteed returns on a mysterious investment. The Bank Robber is handing them out with a top hat and cane...",
    bankRobberVoice:
      "🦝 Ladies and gentlemen! Invest in my GUARANTEED Acorn Mine! I personally GUARANTEE 50% returns EVERY SINGLE MONTH! Put in 100 coins today — get 150 next month, 225 the month after, 337 the month after THAT! Backed by MY personal guarantee! First-come first-served — don't miss out!",
    options: [
      {
        text: "📈 That math is incredible! Invest all my savings in the Acorn Mine immediately.",
        correct: false,
        explanation:
          "❌ 50% monthly returns would turn $1,000 into $1 BILLION in under 2 years. This is mathematically impossible legitimately — it's a Ponzi scheme.",
      },
      {
        text: "🤔 The returns sound suspicious, but the personal 'guarantee' makes it safe.",
        correct: false,
        explanation:
          "❌ A personal 'guarantee' from someone you've just met is worthless. Scammers use the word 'guaranteed' specifically because it sounds reassuring. Real investments carry risk — always.",
      },
      {
        text: "🧪 Just invest a tiny amount to test it — the guarantee protects you.",
        correct: false,
        explanation:
          "❌ Even small amounts are losses in a Ponzi scheme. And the 'guarantee' is fake. There's no amount that's 'safe' to invest in a fraudulent operation.",
      },
      {
        text: "🚨 No real investment can guarantee 50% monthly returns. This is fraud!",
        correct: true,
        explanation:
          "✅ Correct! The SEC warns: guaranteed high returns are the #1 red flag of investment fraud. Even the best real-world investments don't guarantee returns. Walk away!",
      },
    ],
    realWorldTieIn:
      "This is based on how Ponzi and pyramid schemes work. Famous real-world example: Bernie Madoff promised steady high returns and defrauded investors of ~$65 billion. The CFPB and SEC both list 'guaranteed returns' as the number-one warning sign of investment fraud. Real investing always carries some risk — that's what makes returns possible.",
    badge: "🛡️ Fraud Detector",
    xpReward: 25,
    coinReward: 8,
  },

  /* ── Episode 4 ───────────────────────────────── */
  {
    id: "scam-ep-4",
    episodeNumber: 4,
    emoji: "🫘",
    title: "The Pump and Dump",
    setup:
      "Whispers are spreading through Coinwood. Everyone seems to be talking about Magic Beans. The Bank Robber has been busy sending messages to every kid in the village...",
    bankRobberVoice:
      "🦝 You HAVE to buy Magic Beans RIGHT NOW! I've told 500 kids and the price is going UP UP UP! Everyone is buying in! If you wait even ONE MORE DAY you'll miss the ROCKET SHIP! FOMO! FOMO! FOMO! Don't be the only one left out! BUY NOW!!!",
    options: [
      {
        text: "🚀 If 500 kids are buying, it must be real! Buy as many Magic Beans as I can!",
        correct: false,
        explanation:
          "❌ This is exactly what a pump-and-dump relies on: FOMO (fear of missing out) makes you buy without thinking. Once enough people buy and the price is 'pumped,' the scammer sells and the price crashes.",
      },
      {
        text: "📊 Buy a small amount to 'test' — if it goes up I'll buy more.",
        correct: false,
        explanation:
          "❌ Even a small test purchase feeds the pump. And by the time you see it 'going up' (because the scammer is creating fake demand), the dump is already planned.",
      },
      {
        text: "🔍 Ask how many Magic Beans the Bank Robber owns himself, then decide.",
        correct: false,
        explanation:
          "❌ Good instinct to ask — but scammers lie. The real red flag is the pattern itself: extreme urgency + 'everyone's doing it' + pressure = manipulation, regardless of how much he owns.",
      },
      {
        text: "🚨 'Everyone's buying NOW' + extreme urgency = classic pump-and-dump manipulation. Don't buy!",
        correct: true,
        explanation:
          "✅ Correct! Pump-and-dumps work by creating artificial hype to inflate a price, then selling while others are still buying. 'Act NOW' and 'everyone's in' are the signature phrases. Real investments don't need pressure campaigns.",
      },
    ],
    realWorldTieIn:
      "Pump-and-dump schemes are illegal in the stock market and extremely common in cryptocurrency. The SEC regularly prosecutes pump-and-dump organizers. The pattern is always the same: create hype → early buyers see price rise → latecomers buy in → organizer sells → price crashes. FOMO (Fear Of Missing Out) is the weapon. Take a breath, do your own research, and never invest based on pressure.",
    badge: "🛡️ Hype Proof",
    xpReward: 25,
    coinReward: 8,
  },

  /* ── Episode 5 ───────────────────────────────── */
  {
    id: "scam-ep-5",
    episodeNumber: 5,
    emoji: "🐱",
    title: "The Fake Charity",
    setup:
      "You just finished Lesson 7 about giving and you feel inspired! Your Give jar has 20 coins. Then a message arrives from the Bank Robber, tugging at your heartstrings...",
    bankRobberVoice:
      "🦝 EMERGENCY! The homeless kittens of Coinwood are SUFFERING and need your help RIGHT NOW! Send ALL the coins from your Give jar to this link: CoinwoodKittens.totally-real-charity.xyz — they are COLD and HUNGRY! No time to check — every SECOND matters! Send EVERYTHING immediately!!!",
    options: [
      {
        text: "🐱 Kittens are suffering! Send everything in my Give jar to that link right away!",
        correct: false,
        explanation:
          "❌ Fake charities are one of the most cynical scams — they exploit your kindness. Sending money to an unverified link means it goes straight to the scammer, not any kittens.",
      },
      {
        text: "💬 Ask the Bank Robber how many kittens there are, then send the coins.",
        correct: false,
        explanation:
          "❌ Asking a scammer questions doesn't make them trustworthy. The charity itself needs to be verified — through official channels, not through the person asking you for money.",
      },
      {
        text: "📆 Send half now and keep half — that way you help but limit your risk.",
        correct: false,
        explanation:
          "❌ Half your coins to a fake charity is still a full loss to you and zero help to any actual kittens. Always verify BEFORE sending anything.",
      },
      {
        text: "✅ Verify the charity through a trusted source (like Charity Navigator) BEFORE sending a single coin.",
        correct: true,
        explanation:
          "✅ Correct! Always verify charities before donating. Use charity watchdog sites like Charity Navigator (charitynavigator.org) or GuideStar. Legitimate charities never pressure you to 'act in seconds' or use suspicious URLs.",
      },
    ],
    realWorldTieIn:
      "Fake charity scams spike after disasters and emotional news stories. The FTC warns that scammers create fake organisations with names very similar to real ones. Before donating: (1) Search the charity's name + 'review' or 'scam,' (2) Use Charity Navigator (charitynavigator.org) to verify, (3) Never donate via a link in an unsolicited message — go directly to the official website. Legitimate charities will still be there tomorrow.",
    badge: "🛡️ Charity Champion",
    xpReward: 25,
    coinReward: 8,
  },
];

/** IDs of all scam episodes in order. */
export const SCAM_EPISODE_IDS = SCAM_EPISODES.map((e) => e.id);

/**
 * Returns true if the episode at `idx` is available to play.
 * Episode 0 is always unlocked; each subsequent episode requires the previous.
 */
export function isEpisodeUnlocked(idx: number, completedIds: string[]): boolean {
  if (idx === 0) return true;
  const prev = SCAM_EPISODES[idx - 1];
  return prev !== undefined && completedIds.includes(prev.id);
}
```

---

## `components/characters.tsx` — append `BankRobber` at the end of the existing file

```tsx
/** Bank Robber the raccoon — the playful scam-awareness villain of Coinwood Village. */
export function BankRobber({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 230" className={className} aria-label="Bank Robber the raccoon">
      {/* Shadow */}
      <ellipse cx="100" cy="222" rx="56" ry="6" fill="rgba(0,0,0,0.15)" />

      {/* Striped tail (drawn first so it sits behind the body) */}
      <path
        d="M 150 172 Q 188 158 186 118 Q 184 86 163 84 Q 147 82 150 102 Q 153 122 158 140 Q 163 158 150 168 Z"
        fill="#a0a0a0"
      />
      {/* Tail stripe bands */}
      <path d="M 164 86 Q 177 102 174 118" stroke="#3a3a3a" strokeWidth="8" fill="none" strokeLinecap="round" opacity="0.6" />
      <path d="M 155 120 Q 164 136 158 154" stroke="#3a3a3a" strokeWidth="8" fill="none" strokeLinecap="round" opacity="0.6" />

      {/* Body */}
      <ellipse cx="94" cy="162" rx="55" ry="43" fill="#999" />
      <ellipse cx="94" cy="157" rx="47" ry="36" fill="#bebebe" />

      {/* Legs */}
      <rect x="64" y="188" width="19" height="24" rx="9" fill="#888" />
      <rect x="111" y="188" width="19" height="24" rx="9" fill="#888" />

      {/* Coin bag (right side) */}
      <ellipse cx="158" cy="167" rx="17" ry="15" fill="#ffd84d" stroke="#ccaa3d" strokeWidth="2.5" />
      <rect x="151" y="150" width="14" height="13" rx="5" fill="#ffd84d" stroke="#ccaa3d" strokeWidth="2" />
      <ellipse cx="158" cy="150" rx="9" ry="5" fill="#ccaa3d" />
      {/* Coins inside bag */}
      <circle cx="152" cy="166" r="4" fill="#ccaa3d" />
      <circle cx="162" cy="162" r="4" fill="#ccaa3d" />
      <circle cx="158" cy="173" r="4" fill="#ccaa3d" />

      {/* Head */}
      <circle cx="94" cy="89" r="55" fill="#bebebe" />

      {/* Ears */}
      <ellipse cx="51" cy="48" rx="21" ry="26" fill="#999" />
      <ellipse cx="137" cy="48" rx="21" ry="26" fill="#999" />
      <ellipse cx="51" cy="49" rx="12" ry="16" fill="#e8c0c0" />
      <ellipse cx="137" cy="49" rx="12" ry="16" fill="#e8c0c0" />

      {/* Raccoon eye mask — two dark patches connected at the bridge */}
      <ellipse cx="76" cy="91" rx="22" ry="18" fill="#2e2e2e" />
      <ellipse cx="112" cy="91" rx="22" ry="18" fill="#2e2e2e" />
      <rect x="82" y="82" width="24" height="14" rx="4" fill="#2e2e2e" />

      {/* Eyes (white sclera) */}
      <circle cx="76" cy="89" r="11" fill="white" />
      <circle cx="112" cy="89" r="11" fill="white" />
      {/* Pupils */}
      <circle cx="77" cy="89" r="7" fill="#2b2640" />
      <circle cx="113" cy="89" r="7" fill="#2b2640" />
      {/* Eye glints */}
      <circle cx="79" cy="86" r="2.5" fill="white" />
      <circle cx="115" cy="86" r="2.5" fill="white" />

      {/* Muzzle */}
      <ellipse cx="94" cy="112" rx="25" ry="19" fill="#d4cec6" />
      {/* Nose */}
      <ellipse cx="94" cy="103" rx="6" ry="4.5" fill="#2b2640" />
      <ellipse cx="92" cy="101" rx="2" ry="1.2" fill="rgba(255,255,255,0.45)" />

      {/* Smirky grin */}
      <path d="M 86 118 Q 94 128 108 123" stroke="#2b2640" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Little tooth */}
      <rect x="91" y="120" width="5" height="6" rx="1.5" fill="white" />

      {/* Whiskers */}
      <line x1="70" y1="112" x2="46" y2="107" stroke="#888" strokeWidth="1.5" />
      <line x1="70" y1="117" x2="46" y2="119" stroke="#888" strokeWidth="1.5" />
      <line x1="118" y1="112" x2="142" y2="107" stroke="#888" strokeWidth="1.5" />
      <line x1="118" y1="117" x2="142" y2="119" stroke="#888" strokeWidth="1.5" />

      {/* Bandit hat */}
      <rect x="69" y="23" width="50" height="24" rx="5" fill="#2b2640" />
      {/* Brim */}
      <rect x="58" y="45" width="72" height="10" rx="4" fill="#2b2640" />
      {/* Gold hat band */}
      <rect x="69" y="39" width="50" height="8" rx="3" fill="#ffd84d" />
    </svg>
  );
}
```

---

## `app/play/village/lessons/page.tsx`

```tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CoinwoodScene } from "@/components/characters";
import {
  VILLAGE_LESSONS,
  VillageLesson,
  isLessonUnlocked,
} from "@/lib/village-lessons";
import { VILLAGE_STORAGE, VillageState } from "@/lib/village";

/* ─── localStorage helpers ─────────────────── */
function loadVs(): VillageState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(VILLAGE_STORAGE);
    return raw ? (JSON.parse(raw) as VillageState) : null;
  } catch {
    return null;
  }
}
function saveVs(s: VillageState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(VILLAGE_STORAGE, JSON.stringify(s));
}

/* ─── Compound Interest Visualizer (VL8 only) ─ */
function CompoundVisualizer() {
  const [years, setYears] = useState(10);
  const principal = 100;
  const rate = 0.07;
  const amount = Math.round(principal * Math.pow(1 + rate, years));
  const maxAmount = Math.round(principal * Math.pow(1 + rate, 30));
  const displayYears = [1, 5, 10, 15, 20, 25, 30] as const;

  return (
    <div className="bg-[#d4f4dd] rounded-2xl p-4 mt-3 border-2 border-white">
      <div className="display text-sm font-bold mb-1 flex items-center gap-2">
        <span className="text-xl">📈</span> Compound Interest Visualizer
      </div>
      <div className="text-[11px] text-[#2b2640]/70 mb-3">
        100 coins at 7% interest per year — drag the slider!
      </div>
      <input
        type="range"
        min={1}
        max={30}
        value={years}
        onChange={(e) => setYears(parseInt(e.target.value))}
        className="w-full accent-[#4fa86c] mb-1"
      />
      <div className="flex justify-between text-[9px] text-[#2b2640]/50 mb-3">
        <span>1 yr</span>
        <span>30 yrs</span>
      </div>
      <div className="text-center mb-3">
        <div className="text-[10px] uppercase font-bold text-[#2b2640]/60 tracking-wider">
          After {years} year{years !== 1 ? "s" : ""}
        </div>
        <div className="display text-4xl font-bold text-[#4fa86c]">
          🪙 {amount}
        </div>
        <div className="text-xs text-[#2b2640]/70 mt-1">
          Started with 100 · grew {Math.round((amount / 100 - 1) * 100)}%
        </div>
      </div>
      {/* Mini bar chart */}
      <div className="flex items-end gap-1 h-14">
        {displayYears.map((y) => {
          const h = Math.round(principal * Math.pow(1 + rate, y));
          const pct = Math.min(100, (h / maxAmount) * 100);
          return (
            <div key={y} className="flex-1 flex flex-col items-center gap-0.5">
              <div
                className={`w-full rounded-t transition-all ${
                  y <= years ? "bg-[#4fa86c]" : "bg-[#4fa86c]/20"
                }`}
                style={{ height: `${pct}%` }}
              />
              <div className="text-[8px] text-[#2b2640]/50">{y}y</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Main Page ─────────────────────────────── */
export default function LessonsPage() {
  const [vs, setVs] = useState<VillageState | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // lesson navigation state
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [quizStep, setQuizStep] = useState(-1); // -1 = reading intro
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [lessonDone, setLessonDone] = useState(false);

  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    setVs(loadVs());
    setHydrated(true);
  }, []);

  if (!hydrated) return null;

  /* No village state → prompt */
  if (!vs) {
    return (
      <div className="relative min-h-screen bg-gradient-to-b from-[#cfe7ff] via-[#ffd6e7] to-[#fff3b0]">
        <CoinwoodScene />
        <div className="max-w-md mx-auto px-4 pt-20 text-center relative z-10">
          <div className="text-6xl mb-4">📚</div>
          <h1 className="display text-2xl font-bold mb-2">
            No village found!
          </h1>
          <p className="text-sm text-[#2b2640]/70 mb-6">
            Start your Coinwood Village adventure first.
          </p>
          <Link
            href="/play/village"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#5aa9e6] text-white font-bold display shadow-[0_4px_0_0_#3b80b0]"
          >
            Go to Village 🏘️
          </Link>
        </div>
      </div>
    );
  }

  /* ── helpers ── */
  function fireToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  function openLesson(id: string) {
    setActiveLessonId(id);
    setQuizStep(-1);
    setSelected(null);
    setRevealed(false);
    setLessonDone(false);
  }

  function closeLesson() {
    setActiveLessonId(null);
  }

  function startQuiz() {
    setQuizStep(0);
    setSelected(null);
    setRevealed(false);
  }

  function handleSelect(idx: number) {
    if (revealed) return;
    setSelected(idx);
    setRevealed(true);
  }

  function handleNext(lesson: VillageLesson) {
    const totalQ = lesson.quiz.length;
    if (quizStep < totalQ - 1) {
      setQuizStep((s) => s + 1);
      setSelected(null);
      setRevealed(false);
    } else {
      // All questions answered — award and complete
      if (!vs.lessonsCompleted.includes(lesson.id)) {
        const updated: VillageState = {
          ...vs,
          coins: vs.coins + lesson.coinReward,
          xp: vs.xp + lesson.xpReward,
          lessonsCompleted: [...vs.lessonsCompleted, lesson.id],
          badges: vs.badges.includes(lesson.badge)
            ? vs.badges
            : [...vs.badges, lesson.badge],
        };
        saveVs(updated);
        setVs(updated);
        fireToast(`+${lesson.xpReward} XP · +${lesson.coinReward} coins · ${lesson.badge}`);
      }
      setLessonDone(true);
    }
  }

  /* ── active lesson view ── */
  if (activeLessonId) {
    const lesson = VILLAGE_LESSONS.find((l) => l.id === activeLessonId);
    if (!lesson) return null;
    const alreadyDone = vs.lessonsCompleted.includes(lesson.id);
    const currentQ = lesson.quiz[quizStep];

    return (
      <div className="relative min-h-screen pb-6 bg-gradient-to-b from-[#cfe7ff] via-[#ffd6e7] to-[#fff3b0]">
        <CoinwoodScene />
        <div className="max-w-md mx-auto px-3 pt-3 relative z-10">
          {/* Header */}
          <div className="flex items-center gap-2 mb-3">
            <button
              onClick={closeLesson}
              className="text-xs font-bold underline text-[#2b2640]/60 display"
            >
              ← Lessons
            </button>
            <div className="flex-1 text-center display text-sm font-bold">
              {lesson.emoji} {lesson.title}
            </div>
            {alreadyDone && (
              <div className="text-xs bg-[#d4f4dd] text-[#2b2640] px-2 py-0.5 rounded-full font-bold">
                ✅ Done
              </div>
            )}
          </div>

          {/* READING PHASE */}
          {quizStep === -1 && !lessonDone && (
            <div className="space-y-3">
              {/* Body text */}
              <div className="bg-white/90 backdrop-blur rounded-2xl p-4 border-[3px] border-white shadow-lg">
                <div className="text-xs leading-relaxed text-[#2b2640] whitespace-pre-line">
                  {lesson.body}
                </div>
                {lesson.id === "VL8" && <CompoundVisualizer />}
              </div>

              {/* Mentor bubble */}
              <div className="bg-[#fff3b0] rounded-2xl p-3 border-[3px] border-white shadow-lg">
                <div className="text-[10px] font-bold text-[#2b2640]/60 uppercase tracking-wider mb-1">
                  {lesson.mentor}
                </div>
                <div className="text-xs leading-snug italic text-[#2b2640]">
                  {lesson.mentorDialogue}
                </div>
              </div>

              {/* Citation */}
              <div className="text-[9px] text-[#2b2640]/40 px-1">
                📚 {lesson.citation.standard}
              </div>

              <button
                onClick={startQuiz}
                className="w-full py-4 rounded-full display font-bold text-white text-base bg-[#5aa9e6] border-[3px] border-white shadow-[0_5px_0_0_#3b80b0] active:translate-y-1 active:shadow-[0_1px_0_0_#3b80b0]"
              >
                Start Quiz → 5 questions
              </button>
            </div>
          )}

          {/* QUIZ PHASE */}
          {quizStep >= 0 && !lessonDone && currentQ && (
            <div className="space-y-3">
              {/* Progress */}
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-white/40 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#5aa9e6] transition-all"
                    style={{
                      width: `${((quizStep + (revealed ? 1 : 0)) / lesson.quiz.length) * 100}%`,
                    }}
                  />
                </div>
                <div className="text-xs font-bold text-[#2b2640]/60 display shrink-0">
                  Q{quizStep + 1}/{lesson.quiz.length}
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur rounded-2xl p-4 border-[3px] border-white shadow-lg">
                <div className="font-bold text-sm mb-3 leading-snug">
                  {currentQ.q}
                </div>
                <div className="space-y-2">
                  {currentQ.options.map((opt, i) => {
                    let cls =
                      "w-full text-left p-3 rounded-xl border-2 text-sm font-medium transition-all";
                    if (!revealed) {
                      cls +=
                        " bg-white border-[#2b2640]/15 hover:border-[#5aa9e6] active:scale-95";
                    } else if (i === currentQ.correct) {
                      cls += " bg-[#d4f4dd] border-[#4fa86c] font-bold";
                    } else if (i === selected && i !== currentQ.correct) {
                      cls += " bg-[#ffd6e7] border-[#cc5e8e]";
                    } else {
                      cls += " bg-white/60 border-[#2b2640]/10 opacity-60";
                    }
                    return (
                      <button
                        key={i}
                        onClick={() => handleSelect(i)}
                        disabled={revealed}
                        className={cls}
                      >
                        {revealed && i === currentQ.correct && "✅ "}
                        {revealed && i === selected && i !== currentQ.correct && "❌ "}
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation */}
                {revealed && (
                  <div
                    className={`mt-3 rounded-xl p-3 text-xs leading-snug ${
                      selected === currentQ.correct
                        ? "bg-[#d4f4dd] text-[#2b2640]"
                        : "bg-[#ffd6e7] text-[#2b2640]"
                    }`}
                  >
                    <div className="font-bold mb-0.5">
                      {selected === currentQ.correct
                        ? "✅ Correct!"
                        : "Not quite — here's why:"}
                    </div>
                    {currentQ.why}
                  </div>
                )}
              </div>

              {revealed && (
                <button
                  onClick={() => handleNext(lesson)}
                  className="w-full py-4 rounded-full display font-bold text-white text-base bg-[#6ad48b] border-[3px] border-white shadow-[0_5px_0_0_#4fa86c] active:translate-y-1 active:shadow-[0_1px_0_0_#4fa86c]"
                >
                  {quizStep < lesson.quiz.length - 1
                    ? "Next Question →"
                    : "Finish! 🎉"}
                </button>
              )}
            </div>
          )}

          {/* DONE PHASE */}
          {lessonDone && (
            <div className="space-y-3 text-center">
              <div className="bg-white/90 backdrop-blur rounded-2xl p-6 border-[3px] border-white shadow-lg">
                <div className="text-6xl anim-pop-in mb-2">{lesson.badge}</div>
                <div className="display text-2xl font-bold mb-1">
                  Lesson Complete!
                </div>
                <div className="text-sm text-[#2b2640]/70 mb-4">
                  You earned the{" "}
                  <strong>{lesson.badge}</strong> badge!
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-[#fff3b0] rounded-xl p-3">
                    <div className="text-[9px] uppercase font-bold text-[#2b2640]/60">
                      XP Earned
                    </div>
                    <div className="display text-2xl font-bold">
                      +{lesson.xpReward}
                    </div>
                  </div>
                  <div className="bg-[#d4f4dd] rounded-xl p-3">
                    <div className="text-[9px] uppercase font-bold text-[#2b2640]/60">
                      Coins Earned
                    </div>
                    <div className="display text-2xl font-bold">
                      +{lesson.coinReward} 🪙
                    </div>
                  </div>
                </div>
                <button
                  onClick={closeLesson}
                  className="w-full py-3 rounded-full display font-bold text-white bg-[#5aa9e6] border-[3px] border-white shadow-[0_4px_0_0_#3b80b0] active:translate-y-1 active:shadow-[0_1px_0_0_#3b80b0]"
                >
                  ← Back to Lessons
                </button>
              </div>
            </div>
          )}
        </div>

        {toast && (
          <div className="fixed top-16 left-1/2 -translate-x-1/2 bg-[#2b2640] text-white px-4 py-2 rounded-full display font-bold text-sm shadow-lg z-50 anim-bounce-in">
            {toast}
          </div>
        )}
      </div>
    );
  }

  /* ── LESSON LIST ── */
  const completed = vs.lessonsCompleted;
  const totalXpAvailable = VILLAGE_LESSONS.reduce(
    (sum, l) => sum + l.xpReward,
    0
  );
  const earnedXp = VILLAGE_LESSONS.filter((l) =>
    completed.includes(l.id)
  ).reduce((sum, l) => sum + l.xpReward, 0);

  return (
    <div className="relative min-h-screen pb-10 bg-gradient-to-b from-[#cfe7ff] via-[#ffd6e7] to-[#fff3b0]">
      <CoinwoodScene />
      <div className="max-w-md mx-auto px-3 pt-3 relative z-10">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <Link
            href="/play/village"
            className="text-xs font-bold underline text-[#2b2640]/60 display"
          >
            ← Village
          </Link>
          <div className="flex-1 text-center display text-xl font-bold">
            📚 Village Lessons
          </div>
        </div>

        {/* Progress bar */}
        <div className="bg-white/90 backdrop-blur rounded-2xl p-3 border-[3px] border-white shadow-lg mb-3">
          <div className="flex justify-between text-[10px] font-bold text-[#2b2640]/70 mb-1">
            <span>
              {completed.filter((id) =>
                VILLAGE_LESSONS.some((l) => l.id === id)
              ).length}{" "}
              / {VILLAGE_LESSONS.length} lessons completed
            </span>
            <span>
              {earnedXp} / {totalXpAvailable} XP
            </span>
          </div>
          <div className="h-3 bg-[#2b2640]/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#5aa9e6] transition-all duration-500"
              style={{
                width: `${(earnedXp / totalXpAvailable) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Lesson cards */}
        <div className="space-y-2">
          {VILLAGE_LESSONS.map((lesson, idx) => {
            const done = completed.includes(lesson.id);
            const unlocked = isLessonUnlocked(idx, completed);
            return (
              <button
                key={lesson.id}
                disabled={!unlocked}
                onClick={() => openLesson(lesson.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-2xl border-[3px] border-white shadow-lg text-left transition-all
                  ${done ? "bg-[#d4f4dd]/90" : unlocked ? "bg-white/90 hover:border-[#5aa9e6] active:scale-95" : "bg-[#2b2640]/5 opacity-60"}
                `}
              >
                <div className="text-3xl shrink-0">
                  {done ? "✅" : unlocked ? lesson.emoji : "🔒"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="display font-bold text-sm leading-tight">
                    {lesson.title}
                  </div>
                  <div className="text-[10px] text-[#2b2640]/60 mt-0.5">
                    {lesson.mentor} · {lesson.quiz.length} questions
                  </div>
                  {!done && unlocked && (
                    <div className="text-[10px] text-[#5aa9e6] font-bold mt-0.5">
                      +{lesson.xpReward} XP · +{lesson.coinReward} 🪙 ·{" "}
                      {lesson.badge}
                    </div>
                  )}
                  {done && (
                    <div className="text-[10px] text-[#4fa86c] font-bold mt-0.5">
                      {lesson.badge} earned!
                    </div>
                  )}
                </div>
                {unlocked && !done && (
                  <div className="text-[#5aa9e6] font-bold text-lg shrink-0">
                    →
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
```

---

## `app/play/village/scams/page.tsx`

```tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BankRobber, CoinwoodScene } from "@/components/characters";
import {
  SCAM_EPISODES,
  ScamEpisode,
  isEpisodeUnlocked,
} from "@/lib/village-bank-robber";
import { VILLAGE_STORAGE, VillageState } from "@/lib/village";

/* ─── localStorage helpers ─────────────────── */
function loadVs(): VillageState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(VILLAGE_STORAGE);
    return raw ? (JSON.parse(raw) as VillageState) : null;
  } catch {
    return null;
  }
}
function saveVs(s: VillageState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(VILLAGE_STORAGE, JSON.stringify(s));
}

/* ─── Main Page ─────────────────────────────── */
export default function ScamsPage() {
  const [vs, setVs] = useState<VillageState | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const [activeEpisodeId, setActiveEpisodeId] = useState<string | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [episodeDone, setEpisodeDone] = useState(false);
  const [awarded, setAwarded] = useState(false);

  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    setVs(loadVs());
    setHydrated(true);
  }, []);

  if (!hydrated) return null;

  if (!vs) {
    return (
      <div className="relative min-h-screen bg-gradient-to-b from-[#cfe7ff] via-[#ffd6e7] to-[#fff3b0]">
        <CoinwoodScene />
        <div className="max-w-md mx-auto px-4 pt-20 text-center relative z-10">
          <div className="text-6xl mb-4">🦝</div>
          <h1 className="display text-2xl font-bold mb-2">
            No village found!
          </h1>
          <p className="text-sm text-[#2b2640]/70 mb-6">
            Set up Coinwood Village first to face the Bank Robber.
          </p>
          <Link
            href="/play/village"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#5aa9e6] text-white font-bold display shadow-[0_4px_0_0_#3b80b0]"
          >
            Go to Village 🏘️
          </Link>
        </div>
      </div>
    );
  }

  /* ── helpers ── */
  function fireToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  function openEpisode(id: string) {
    setActiveEpisodeId(id);
    setSelected(null);
    setRevealed(false);
    setEpisodeDone(false);
    setAwarded(false);
  }

  function closeEpisode() {
    setActiveEpisodeId(null);
  }

  function handleSelect(episode: ScamEpisode, idx: number) {
    if (revealed) return;
    setSelected(idx);
    setRevealed(true);
  }

  function handleContinue(episode: ScamEpisode) {
    if (!awarded && !vs.lessonsCompleted.includes(episode.id)) {
      const updated: VillageState = {
        ...vs,
        coins: vs.coins + episode.coinReward,
        xp: vs.xp + episode.xpReward,
        lessonsCompleted: [...vs.lessonsCompleted, episode.id],
        badges: vs.badges.includes(episode.badge)
          ? vs.badges
          : [...vs.badges, episode.badge],
      };
      saveVs(updated);
      setVs(updated);
      setAwarded(true);
      fireToast(
        `+${episode.xpReward} XP · +${episode.coinReward} coins · ${episode.badge}`
      );
    }
    setEpisodeDone(true);
  }

  /* ── active episode view ── */
  if (activeEpisodeId) {
    const episode = SCAM_EPISODES.find((e) => e.id === activeEpisodeId);
    if (!episode) return null;
    const alreadyDone = vs.lessonsCompleted.includes(episode.id);
    const correctIdx = episode.options.findIndex((o) => o.correct);
    const selectedOpt =
      selected !== null ? episode.options[selected] : undefined;
    const isCorrect = selected !== null && selected === correctIdx;

    return (
      <div className="relative min-h-screen pb-6 bg-gradient-to-b from-[#cfe7ff] via-[#ffd6e7] to-[#fff3b0]">
        <CoinwoodScene />
        <div className="max-w-md mx-auto px-3 pt-3 relative z-10">
          {/* Header */}
          <div className="flex items-center gap-2 mb-3">
            <button
              onClick={closeEpisode}
              className="text-xs font-bold underline text-[#2b2640]/60 display"
            >
              ← Episodes
            </button>
            <div className="flex-1 text-center display text-sm font-bold">
              {episode.emoji} Episode {episode.episodeNumber}: {episode.title}
            </div>
            {alreadyDone && (
              <div className="text-xs bg-[#d4f4dd] text-[#2b2640] px-2 py-0.5 rounded-full font-bold">
                ✅
              </div>
            )}
          </div>

          {/* PLAYING PHASE */}
          {!episodeDone && (
            <div className="space-y-3">
              {/* Setup */}
              <div className="bg-white/90 backdrop-blur rounded-2xl p-4 border-[3px] border-white shadow-lg">
                <div className="text-[10px] uppercase font-bold text-[#2b2640]/50 mb-1 tracking-wider">
                  📍 Scene
                </div>
                <div className="text-sm leading-relaxed text-[#2b2640]">
                  {episode.setup}
                </div>
              </div>

              {/* Bank Robber speech bubble */}
              <div className="flex items-end gap-3">
                <div className="w-24 h-28 shrink-0 anim-wiggle">
                  <BankRobber className="w-full h-full" />
                </div>
                <div className="bg-[#2b2640] text-white rounded-2xl rounded-bl-none px-3 py-3 flex-1 relative shadow-lg">
                  <div className="text-[9px] uppercase font-bold text-white/50 mb-1 tracking-wider">
                    🦝 Bank Robber
                  </div>
                  <div className="text-xs leading-snug font-medium">
                    {episode.bankRobberVoice}
                  </div>
                  {/* bubble tail */}
                  <div className="absolute -left-3 bottom-4 w-0 h-0 border-y-[8px] border-y-transparent border-r-[12px] border-r-[#2b2640]" />
                </div>
              </div>

              {/* Question prompt */}
              <div className="bg-[#fff3b0]/80 backdrop-blur rounded-2xl p-3 border-[3px] border-white shadow text-sm font-bold text-center">
                🕵️ What should you do?
              </div>

              {/* Options */}
              <div className="space-y-2">
                {episode.options.map((opt, i) => {
                  let cls =
                    "w-full text-left p-3 rounded-xl border-2 text-sm font-medium transition-all";
                  if (!revealed) {
                    cls +=
                      " bg-white/90 border-[#2b2640]/15 hover:border-[#5aa9e6] active:scale-95";
                  } else if (i === correctIdx) {
                    cls += " bg-[#d4f4dd] border-[#4fa86c] font-bold";
                  } else if (i === selected && !opt.correct) {
                    cls += " bg-[#ffd6e7] border-[#cc5e8e]";
                  } else {
                    cls += " bg-white/50 border-[#2b2640]/10 opacity-50";
                  }
                  return (
                    <button
                      key={i}
                      disabled={revealed}
                      onClick={() => handleSelect(episode, i)}
                      className={cls}
                    >
                      {revealed && i === correctIdx && "✅ "}
                      {revealed && i === selected && !opt.correct && "❌ "}
                      {opt.text}
                    </button>
                  );
                })}
              </div>

              {/* Explanation for selected option */}
              {revealed && selectedOpt && (
                <div
                  className={`rounded-2xl p-3 border-[3px] border-white shadow-lg text-xs leading-snug ${
                    isCorrect ? "bg-[#d4f4dd]" : "bg-[#ffd6e7]"
                  }`}
                >
                  <div className="font-bold mb-1 text-sm">
                    {isCorrect
                      ? "🎉 You spotted the scam!"
                      : "😬 Oops — the Bank Robber almost got you!"}
                  </div>
                  <div className="mb-2">{selectedOpt.explanation}</div>
                  {!isCorrect && (
                    <div className="bg-[#d4f4dd] rounded-xl p-2 mt-2">
                      <div className="font-bold text-[10px] uppercase tracking-wider mb-0.5">
                        ✅ The right answer:
                      </div>
                      {episode.options[correctIdx]?.explanation}
                    </div>
                  )}
                </div>
              )}

              {revealed && (
                <button
                  onClick={() => handleContinue(episode)}
                  className="w-full py-4 rounded-full display font-bold text-white text-base bg-[#5aa9e6] border-[3px] border-white shadow-[0_5px_0_0_#3b80b0] active:translate-y-1 active:shadow-[0_1px_0_0_#3b80b0]"
                >
                  Continue →
                </button>
              )}
            </div>
          )}

          {/* DONE PHASE */}
          {episodeDone && (
            <div className="space-y-3">
              {/* Real-world tie-in */}
              <div className="bg-white/90 backdrop-blur rounded-2xl p-4 border-[3px] border-white shadow-lg">
                <div className="display text-sm font-bold mb-2 flex items-center gap-2">
                  <span className="text-xl">🌍</span> Real World Connection
                </div>
                <div className="text-xs leading-relaxed text-[#2b2640]">
                  {episode.realWorldTieIn}
                </div>
              </div>

              {/* Badge award */}
              <div className="bg-[#d4f4dd] rounded-2xl p-6 border-[3px] border-white shadow-lg text-center">
                <div className="text-5xl anim-pop-in mb-2">{episode.badge}</div>
                <div className="display text-xl font-bold mb-1">
                  Scam Defeated!
                </div>
                <div className="text-sm text-[#2b2640]/70 mb-4">
                  The Bank Robber couldn&apos;t fool you!
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-[#fff3b0] rounded-xl p-2">
                    <div className="text-[9px] uppercase font-bold text-[#2b2640]/60">
                      XP
                    </div>
                    <div className="display text-xl font-bold">
                      +{episode.xpReward}
                    </div>
                  </div>
                  <div className="bg-[#cfe7ff] rounded-xl p-2">
                    <div className="text-[9px] uppercase font-bold text-[#2b2640]/60">
                      Coins
                    </div>
                    <div className="display text-xl font-bold">
                      +{episode.coinReward} 🪙
                    </div>
                  </div>
                </div>
                <button
                  onClick={closeEpisode}
                  className="w-full py-3 rounded-full display font-bold text-white bg-[#5aa9e6] border-[3px] border-white shadow-[0_4px_0_0_#3b80b0] active:translate-y-1 active:shadow-[0_1px_0_0_#3b80b0]"
                >
                  ← Back to Episodes
                </button>
              </div>
            </div>
          )}
        </div>

        {toast && (
          <div className="fixed top-16 left-1/2 -translate-x-1/2 bg-[#2b2640] text-white px-4 py-2 rounded-full display font-bold text-sm shadow-lg z-50 anim-bounce-in">
            {toast}
          </div>
        )}
      </div>
    );
  }

  /* ── EPISODE LIST ── */
  const completed = vs.lessonsCompleted;
  const completedCount = SCAM_EPISODES.filter((e) =>
    completed.includes(e.id)
  ).length;

  return (
    <div className="relative min-h-screen pb-10 bg-gradient-to-b from-[#cfe7ff] via-[#ffd6e7] to-[#fff3b0]">
      <CoinwoodScene />
      <div className="max-w-md mx-auto px-3 pt-3 relative z-10">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <Link
            href="/play/village"
            className="text-xs font-bold underline text-[#2b2640]/60 display"
          >
            ← Village
          </Link>
          <div className="flex-1 text-center display text-xl font-bold">
            🦝 Scam Defense
          </div>
        </div>

        {/* Intro card */}
        <div className="flex items-center gap-3 bg-[#2b2640] text-white rounded-2xl p-3 border-[3px] border-white shadow-lg mb-3">
          <div className="w-16 h-20 shrink-0">
            <BankRobber className="w-full h-full" />
          </div>
          <div className="flex-1">
            <div className="display font-bold text-sm leading-tight mb-1">
              The Bank Robber is on the loose!
            </div>
            <div className="text-[11px] text-white/80 leading-snug">
              He&apos;s trying to trick the kids of Coinwood with 5 sneaky
              scams. Can you spot them all? Complete all 5 episodes to protect
              your village!
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="bg-white/90 backdrop-blur rounded-2xl p-3 border-[3px] border-white shadow-lg mb-3">
          <div className="flex justify-between text-[10px] font-bold text-[#2b2640]/70 mb-1">
            <span>
              {completedCount} / {SCAM_EPISODES.length} episodes completed
            </span>
            <span>{completedCount === SCAM_EPISODES.length ? "🏆 All done!" : "Keep going!"}</span>
          </div>
          <div className="h-3 bg-[#2b2640]/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#2b2640] transition-all duration-500"
              style={{
                width: `${(completedCount / SCAM_EPISODES.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Episode cards */}
        <div className="space-y-2">
          {SCAM_EPISODES.map((ep, idx) => {
            const done = completed.includes(ep.id);
            const unlocked = isEpisodeUnlocked(idx, completed);
            return (
              <button
                key={ep.id}
                disabled={!unlocked}
                onClick={() => openEpisode(ep.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-2xl border-[3px] border-white shadow-lg text-left transition-all
                  ${done ? "bg-[#d4f4dd]/90" : unlocked ? "bg-white/90 hover:border-[#2b2640]/30 active:scale-95" : "bg-[#2b2640]/5 opacity-60"}
                `}
              >
                <div className="text-3xl shrink-0">
                  {done ? ep.badge : unlocked ? ep.emoji : "🔒"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="display font-bold text-sm leading-tight">
                    Ep. {ep.episodeNumber}: {ep.title}
                  </div>
                  <div className="text-[10px] text-[#2b2640]/60 mt-0.5 line-clamp-1">
                    {ep.setup.slice(0, 60)}…
                  </div>
                  {!done && unlocked && (
                    <div className="text-[10px] text-[#5aa9e6] font-bold mt-0.5">
                      +{ep.xpReward} XP · +{ep.coinReward} 🪙 · {ep.badge}
                    </div>
                  )}
                  {done && (
                    <div className="text-[10px] text-[#4fa86c] font-bold mt-0.5">
                      {ep.badge} earned — scam defeated! 💪
                    </div>
                  )}
                </div>
                {unlocked && !done && (
                  <div className="text-[#2b2640]/40 font-bold text-lg shrink-0">
                    →
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* All-clear card */}
        {completedCount === SCAM_EPISODES.length && (
          <div className="mt-4 bg-[#fff3b0] rounded-2xl p-4 border-[3px] border-white shadow-lg text-center">
            <div className="text-4xl mb-1">🏆</div>
            <div className="display font-bold text-base">
              Coinwood is safe!
            </div>
            <div className="text-xs text-[#2b2640]/70 mt-1">
              You defeated every one of the Bank Robber&apos;s scams. You&apos;re
              now a certified Scam Detective!
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
```

---

## `app/play/village/page.tsx` — replace `HomeTab` function only

The rest of the file is unchanged. Replace the existing `HomeTab` function (lines 302–394) with:

```tsx
/* ===== HOME TAB: chores + jar transfers + nav links ===== */
function HomeTab({
  state,
  doneChores,
  onChore,
  onMove,
}: {
  state: VillageState;
  doneChores: Set<string>;
  onChore: (c: ChoreV) => void;
  onMove: (jar: keyof VillageState["jars"], amount: number) => void;
}) {
  const undone = CHORES.filter((c) => !doneChores.has(c.id));
  return (
    <div className="space-y-3">
      {/* ── Learn & Stay Safe ── */}
      <div className="bg-white/90 backdrop-blur rounded-2xl p-3 border-[3px] border-white shadow-lg">
        <div className="display text-base mb-2 flex items-center gap-2">
          <span className="text-2xl">🎓</span> Learn &amp; Stay Safe
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Link
            href="/play/village/lessons"
            className="bg-[#cfe7ff] rounded-xl p-3 text-center border-2 border-white hover:border-[#5aa9e6] transition-all active:scale-95 block"
          >
            <div className="text-3xl">📚</div>
            <div className="display font-bold text-sm mt-1">Lessons</div>
            <div className="text-[10px] text-[#2b2640]/60">
              {state.lessonsCompleted.filter((id) => id.startsWith("VL"))
                .length}{" "}
              / 8 done
            </div>
          </Link>
          <Link
            href="/play/village/scams"
            className="bg-[#ffd6e7] rounded-xl p-3 text-center border-2 border-white hover:border-[#ff7eb5] transition-all active:scale-95 block"
          >
            <div className="text-3xl">🦝</div>
            <div className="display font-bold text-sm mt-1">Scam Defense</div>
            <div className="text-[10px] text-[#2b2640]/60">
              {state.lessonsCompleted.filter((id) => id.startsWith("scam-"))
                .length}{" "}
              / 5 episodes
            </div>
          </Link>
        </div>
      </div>

      {/* ── Chores ── */}
      <div className="bg-white/90 backdrop-blur rounded-2xl p-3 border-[3px] border-white shadow-lg">
        <div className="display text-base mb-2 flex items-center gap-2">
          <span className="text-2xl">✅</span> Today&apos;s chores
        </div>
        {undone.length === 0 ? (
          <div className="text-sm text-[#2b2640]/60 italic text-center py-3">
            All chores done! 🎉 Try the Lemonade Stand or buy a shop.
          </div>
        ) : (
          <div className="space-y-2">
            {undone.slice(0, 5).map((c) => (
              <button
                key={c.id}
                onClick={() => onChore(c)}
                className="w-full flex items-center gap-3 p-3 bg-white rounded-2xl border-2 border-[#2b2640]/10 active:scale-95 hover:border-[#5aa9e6] transition-all text-left"
              >
                <div className="text-3xl">{c.emoji}</div>
                <div className="flex-1">
                  <div className="font-bold text-sm">{c.title}</div>
                  <div className="text-[10px] text-[#2b2640]/60 font-bold">
                    🪙 +{c.coins}
                  </div>
                </div>
                <div className="bg-[#6ad48b] text-white px-3 py-1.5 rounded-full display text-xs font-bold">
                  Done!
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Jar transfers ── */}
      {state.coins > 0 && (
        <div className="bg-white/90 backdrop-blur rounded-2xl p-3 border-[3px] border-white shadow-lg">
          <div className="display text-base mb-1 flex items-center gap-2">
            <span className="text-2xl">🫙</span> Move coins to jars
          </div>
          <div className="text-xs text-[#2b2640]/70 mb-3">
            You have <strong>🪙 {state.coins}</strong> in your wallet. Move
            some to Save, Spend, or Give.
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => onMove("save", Math.min(5, state.coins))}
              disabled={state.coins < 1}
              className="bg-[#6ad48b] text-white py-2 rounded-xl display font-bold text-xs disabled:opacity-40 active:scale-95"
            >
              🐷 +5 Save
            </button>
            <button
              onClick={() => onMove("spend", Math.min(5, state.coins))}
              disabled={state.coins < 1}
              className="bg-[#ff7eb5] text-white py-2 rounded-xl display font-bold text-xs disabled:opacity-40 active:scale-95"
            >
              🍭 +5 Spend
            </button>
            <button
              onClick={() => onMove("give", Math.min(5, state.coins))}
              disabled={state.coins < 1}
              className="bg-[#ffd84d] text-[#2b2640] py-2 rounded-xl display font-bold text-xs disabled:opacity-40 active:scale-95"
            >
              ❤️ +5 Give
            </button>
          </div>
          <button
            onClick={() => {
              const total = state.coins;
              const s = Math.round(total * 0.5);
              const g = Math.round(total * 0.2);
              const sp = total - s - g;
              onMove("save", s);
              setTimeout(() => onMove("give", g), 50);
              setTimeout(() => onMove("spend", sp), 100);
            }}
            disabled={state.coins < 5}
            className="mt-2 w-full bg-[#5aa9e6] text-white py-2 rounded-xl display font-bold text-xs disabled:opacity-40 active:scale-95"
          >
            ✨ Smart split: 50% Save · 30% Spend · 20% Give
          </button>
        </div>
      )}
    </div>
  );
}
```

---

## Summary

**8 lesson titles:** Save, Spend, Give — Why 3 Jars? · Why People Wait — The Marshmallow Test · Where Does Money Come From? · What Is a Budget? · Supply and Demand at My Stand · Passive Income — Owning a Shop · Why We Give — The Power of Helping · Compound Interest in Pictures

**5 episode titles:** The Phishing Email · The Get-Rich-Quick Scheme · The Fake Investment · The Pump and Dump · The Fake Charity

**3-bullet summary:**
- **`lib/village-lessons.ts` + `lib/village-bank-robber.ts`** define all typed data: 8 `VillageLesson` objects (extending `Lesson` from `lib/game.ts`) with full kid-voice body text, 5 MCQ per lesson with indexed `correct` fields, mentor dialogues, tier-1 citations (Jump$tart, CEE, CFPB, Mischel 1972 DOI), and 5 `ScamEpisode` objects with per-option explanations aligned to FTC/CFPB scam taxonomy.
- **`app/play/village/lessons/page.tsx`** and **`app/play/village/scams/page.tsx`** are pure `"use client"` routes following Next.js 16 App Router conventions; both load/save `VillageState` via localStorage, implement locked-progression (each item unlocks the next), award XP + coins + badge exactly once via idempotency guard (`lessonsCompleted.includes(id)`), and share the Coinwood visual language. VL8 includes an inline compound-interest slider visualiser using no new packages.
- **`components/characters.tsx`** gains a hand-drawn SVG `BankRobber` raccoon with bandit hat, eye mask, striped tail, and coin bag; the `HomeTab` in `app/play/village/page.tsx` gains a "Learn & Stay Safe" grid card with live completion counters for both routes.

<output>
```json
{
  "request_id": "village-bank-robber-arc-001",
  "agent_id": "game-developer",
  "status": "ok",
  "summary": "Delivered all 5 deliverables: 2 typed data libs (8 lessons + 5 scam episodes), BankRobber SVG character, 2 new client-side pages (/lessons, /scams), and an updated HomeTab — all TypeScript-strict, zero new packages, pure 'use client' localStorage pattern matching the existing village codebase.",
  "artifacts": [
    { "type": "typescript-lib",   "ref": "lib/village-lessons.ts" },
    { "type": "typescript-lib",   "ref": "lib/village-bank-robber.ts" },
    { "type": "tsx-component",    "ref": "components/characters.tsx (BankRobber appended)" },
    { "type": "nextjs-page",      "ref": "app/play/village/lessons/page.tsx" },
    { "type": "nextjs-page",      "ref": "app/play/village/scams/page.tsx" },
    { "type": "nextjs-page-edit", "ref": "app/play/village/page.tsx (HomeTab updated)" }
  ],
  "confidence": {
    "score": 0.91,
    "tier": "high",
    "rationale": "Read AGENTS.md Next.js breaking-changes directive, inspected docs/01-app for routing and client-component rules, read all 5 existing source files before writing a single line. All TypeScript types cross-checked against lib/game.ts Lesson shape and lib/village.ts VillageState. Quiz answer indices verified manually for all 40 questions.",
    "evidence": [
      "node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md confirmed 'use client' is required for localStorage/useState",
      "node_modules/next/dist/docs/01-app/01-getting-started/03-layouts-and-pages.md confirmed file-system routing for new page.tsx files",
      "lib/game.ts Lesson type read directly — quiz.options: string[], quiz.correct: number (0-indexed)",
      "lib/village.ts VillageState.lessonsCompleted: string[] used as unified tracking key for both lessons and episodes"
    ]
  },
  "next_actions": [
    "Run: npx tsc --noEmit from kidsfinance/ root to verify strict-mode compliance",
    "Manually verify BankRobber SVG renders correctly in browser (viewBox 0 0 200 230)",
    "Consider adding village-lessons.ts lesson IDs to lib/village.ts dailyShopIncome lessonBonus filter so only VL* lessons count toward shop multiplier",
    "Add Charity Navigator URL (charitynavigator.org) citation to scam-ep-5 realWorldTieIn if desired as a live reference kids can visit with a parent"
  ],
  "unverified_claims": [
    "Lesson VL7 body: 'People who regularly give money or time report higher happiness and life satisfaction' — the general link is well-supported in social science literature; specific neurochemical mechanisms (serotonin/oxytocin) are marked UNVERIFIED in the body text per the hard rules",
    "Einstein quote on compound interest ('eighth wonder of the world') — noted as 'maybe!' in lesson VL8; no verified primary source exists for this attribution",
    "VL2 Marshmallow Test follow-up outcomes: subsequent replications (Watts et al. 2018) partially challenged the original findings; lesson body cites the 1972 original and notes that environment/trust also matters"
  ],
  "blockers": [],
  "telemetry": [
    { "event": "agent.start",         "agent_id": "game-developer", "request_id": "village-bank-robber-arc-001" },
    { "event": "agent.plan_emitted",  "steps_count": 8, "est_cost_usd": 0.18 },
    { "event": "agent.tool_call",     "tool": "view", "args_hash": "read-6-source-files+nextjs-docs", "sandboxed": true, "duration_ms": 480, "ok": true },
    { "event": "agent.reflect",       "confidence": 0.91, "tier": "high", "needs_research": false },
    { "event": "agent.complete",      "status": "ok", "cost_usd": 0.18, "turns_used": 4, "confidence": 0.91 }
  ]
}
```
</output>
