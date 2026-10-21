const db = require("./db");
const rows = [
["Python Developer Intern","BrightByte Labs","Development","Remote","8 weeks","₹8,000/month","Build small Python features and learn from code reviews."],
["Frontend Development Intern","PixelCraft Studio","Development","Hybrid","3 months","₹10,000/month","Create responsive web pages using HTML, CSS, and JavaScript."],
["UI/UX Design Intern","Northstar Creative","Design","Remote","10 weeks","₹7,000/month","Create wireframes and improve digital product experiences."],
["Data Analytics Intern","InsightSpring","Data & AI","Hybrid","12 weeks","₹9,000/month","Prepare reports and explore data trends using Python."],
["Digital Marketing Intern","MangoTree Media","Marketing","On-site","2 months","₹6,000/month","Help with content planning and campaign reporting."],
["Cybersecurity Intern","SecurePath Systems","Cybersecurity","Remote","8 weeks","₹8,500/month","Learn security fundamentals and document safe testing practices."]
];
if (db.prepare("SELECT COUNT(*) n FROM internships").get().n === 0) {
 const ins = db.prepare("INSERT INTO internships(title,company,domain,location,duration,stipend,description) VALUES(?,?,?,?,?,?,?)");
 const tx = db.transaction(items => items.forEach(x => ins.run(...x))); tx(rows);
 console.log(`Seeded ${rows.length} sample records.`);
} else console.log("Database already contains records; skipped seeding.");
db.close();
