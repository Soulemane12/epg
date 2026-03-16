import { AppStore, User, Profile, Event, Referral, Resource, Announcement, LeadershipMember, FeedPost, MessageThread, MeetingRequest } from "@/types";
import { canonicalThreadId } from "./utils";

export const SEED_VERSION = 1;

export function isSeedLoaded(store: AppStore): boolean {
  return store.users.length > 0;
}

export function getSeedData(): AppStore {
  const now = new Date();
  const d = (daysAgo: number) => new Date(now.getTime() - daysAgo * 86400000).toISOString();
  const future = (daysFromNow: number) => new Date(now.getTime() + daysFromNow * 86400000).toISOString();

  const users: User[] = [
    { id: "u_admin", email: "admin@epg.com", password: "admin123", fullName: "Marcus Webb", role: "admin", approvalStatus: "approved", createdAt: d(120) },
    { id: "u_exec1", email: "diana@epg.com", password: "exec123", fullName: "Diana Holloway", role: "executive", approvalStatus: "approved", createdAt: d(100) },
    { id: "u_exec2", email: "raymond@epg.com", password: "exec123", fullName: "Raymond Osei", role: "executive", approvalStatus: "approved", createdAt: d(95) },
    { id: "u_cl1", email: "sarah@epg.com", password: "leader123", fullName: "Sarah Nguyen", role: "chapter_leader", approvalStatus: "approved", createdAt: d(80) },
    { id: "u_cl2", email: "carlos@epg.com", password: "leader123", fullName: "Carlos Mendez", role: "chapter_leader", approvalStatus: "approved", createdAt: d(75) },
    { id: "u_cl3", email: "priya@epg.com", password: "leader123", fullName: "Priya Sharma", role: "chapter_leader", approvalStatus: "approved", createdAt: d(70) },
    { id: "u_cl4", email: "james@epg.com", password: "leader123", fullName: "James O'Brien", role: "chapter_leader", approvalStatus: "approved", createdAt: d(65) },
    { id: "u_cl5", email: "michelle@epg.com", password: "leader123", fullName: "Michelle Torres", role: "chapter_leader", approvalStatus: "approved", createdAt: d(60) },
    { id: "u_m1", email: "alex@epg.com", password: "member123", fullName: "Alex Kim", role: "member", approvalStatus: "approved", createdAt: d(55) },
    { id: "u_m2", email: "brittany@epg.com", password: "member123", fullName: "Brittany Johnson", role: "member", approvalStatus: "approved", createdAt: d(50) },
    { id: "u_m3", email: "derek@epg.com", password: "member123", fullName: "Derek Washington", role: "member", approvalStatus: "approved", createdAt: d(48) },
    { id: "u_m4", email: "elena@epg.com", password: "member123", fullName: "Elena Vasquez", role: "member", approvalStatus: "approved", createdAt: d(45) },
    { id: "u_m5", email: "frank@epg.com", password: "member123", fullName: "Frank Deluca", role: "member", approvalStatus: "approved", createdAt: d(40) },
    { id: "u_m6", email: "grace@epg.com", password: "member123", fullName: "Grace Park", role: "member", approvalStatus: "approved", createdAt: d(38) },
    { id: "u_m7", email: "henry@epg.com", password: "member123", fullName: "Henry Blackwell", role: "member", approvalStatus: "approved", createdAt: d(35) },
    { id: "u_m8", email: "isabel@epg.com", password: "member123", fullName: "Isabel Reyes", role: "member", approvalStatus: "approved", createdAt: d(30) },
    { id: "u_m9", email: "jason@epg.com", password: "member123", fullName: "Jason Patel", role: "member", approvalStatus: "approved", createdAt: d(25) },
    { id: "u_m10", email: "karen@epg.com", password: "member123", fullName: "Karen Mitchell", role: "member", approvalStatus: "approved", createdAt: d(22) },
    { id: "u_m11", email: "leon@epg.com", password: "member123", fullName: "Leon Foster", role: "member", approvalStatus: "approved", createdAt: d(20) },
    { id: "u_m12", email: "maya@epg.com", password: "member123", fullName: "Maya Thornton", role: "member", approvalStatus: "approved", createdAt: d(18) },
    { id: "u_m13", email: "noah@epg.com", password: "member123", fullName: "Noah Griffin", role: "member", approvalStatus: "approved", createdAt: d(15) },
    { id: "u_m14", email: "olivia@epg.com", password: "member123", fullName: "Olivia Banks", role: "member", approvalStatus: "approved", createdAt: d(10) },
    { id: "u_m15", email: "peter@epg.com", password: "member123", fullName: "Peter Sullivan", role: "member", approvalStatus: "approved", createdAt: d(5) },
    { id: "u_pending1", email: "newmember@example.com", password: "test123", fullName: "Taylor Brooks", role: "member", approvalStatus: "pending", createdAt: d(2) },
    { id: "u_pending2", email: "another@example.com", password: "test456", fullName: "Jordan Ellis", role: "member", approvalStatus: "pending", createdAt: d(1) },
  ];

  const profiles: Profile[] = [
    { userId: "u_admin", bio: "Founder and administrator of EPG. Dedicated to connecting executives across the country.", expertise: ["Leadership", "Strategy", "Operations"], companyName: "EPG Headquarters", title: "Executive Director", phone: "555-0100", website: "https://epg.com", state: "NY", industry: "Consulting", specialties: ["Executive Networking", "Business Development"], photoUrl: "/avatars/marcus.jpg", videoUrl: "" },
    { userId: "u_exec1", bio: "20 years in finance and venture capital. Passionate about empowering entrepreneurs.", expertise: ["Venture Capital", "M&A", "Finance"], companyName: "Holloway Capital Group", title: "Managing Partner", phone: "555-0101", website: "", state: "CA", industry: "Finance", specialties: ["VC Funding", "Startups"], photoUrl: "/avatars/diana.jpg", videoUrl: "" },
    { userId: "u_exec2", bio: "Serial entrepreneur and technology executive. Built and sold 3 companies.", expertise: ["Technology", "Product", "Entrepreneurship"], companyName: "Osei Ventures", title: "CEO", phone: "555-0102", website: "", state: "TX", industry: "Technology", specialties: ["SaaS", "Digital Transformation"], photoUrl: "/avatars/raymond.jpg", videoUrl: "" },
    { userId: "u_cl1", bio: "West Coast chapter leader. Real estate developer focused on sustainable projects.", expertise: ["Real Estate", "Sustainability", "Development"], companyName: "Nguyen Properties", title: "Principal", phone: "555-0103", website: "", state: "CA", industry: "Real Estate", specialties: ["Commercial Real Estate", "Green Building"], photoUrl: "/avatars/sarah.jpg", videoUrl: "" },
    { userId: "u_cl2", bio: "Texas chapter leader. Insurance and risk management specialist.", expertise: ["Insurance", "Risk Management", "Benefits"], companyName: "Mendez Insurance Group", title: "President", phone: "555-0104", website: "", state: "TX", industry: "Insurance", specialties: ["Commercial Insurance", "Employee Benefits"], photoUrl: "/avatars/carlos.jpg", videoUrl: "" },
    { userId: "u_cl3", bio: "Midwest chapter leader. Healthcare technology consultant.", expertise: ["Healthcare IT", "Consulting", "Digital Health"], companyName: "Sharma Health Solutions", title: "Managing Consultant", phone: "555-0105", website: "", state: "IL", industry: "Healthcare", specialties: ["EHR Systems", "Telehealth"], photoUrl: "/avatars/priya.jpg", videoUrl: "" },
    { userId: "u_cl4", bio: "Northeast chapter leader. Attorney specializing in corporate law.", expertise: ["Corporate Law", "M&A", "Compliance"], companyName: "O'Brien Law Partners", title: "Senior Partner", phone: "555-0106", website: "", state: "NY", industry: "Legal", specialties: ["Corporate Transactions", "Regulatory Compliance"], photoUrl: "/avatars/james.jpg", videoUrl: "" },
    { userId: "u_cl5", bio: "Southeast chapter leader. Marketing and brand strategy expert.", expertise: ["Marketing", "Brand Strategy", "Digital"], companyName: "Torres Creative Agency", title: "Founder & CEO", phone: "555-0107", website: "", state: "FL", industry: "Marketing", specialties: ["Brand Identity", "Growth Marketing"], photoUrl: "/avatars/michelle.jpg", videoUrl: "" },
    { userId: "u_m1", bio: "Software engineer turned entrepreneur. Building the future of logistics.", expertise: ["Software Development", "Logistics", "AI"], companyName: "Kim Logistics Tech", title: "Founder", phone: "555-0108", website: "", state: "WA", industry: "Technology", specialties: ["Supply Chain", "Machine Learning"], photoUrl: "/avatars/alex.jpg", videoUrl: "" },
    { userId: "u_m2", bio: "CPA with expertise in small business taxation and financial planning.", expertise: ["Accounting", "Tax Planning", "Finance"], companyName: "Johnson CPA Services", title: "Principal CPA", phone: "555-0109", website: "", state: "GA", industry: "Finance", specialties: ["Business Tax", "Bookkeeping"], photoUrl: "/avatars/brittany.jpg", videoUrl: "" },
    { userId: "u_m3", bio: "Commercial real estate broker with 15 years of market experience.", expertise: ["Real Estate", "Commercial Leasing", "Investment"], companyName: "Washington Realty", title: "Senior Broker", phone: "555-0110", website: "", state: "TX", industry: "Real Estate", specialties: ["Office Space", "Industrial Properties"], photoUrl: "/avatars/derek.jpg", videoUrl: "" },
    { userId: "u_m4", bio: "HR consultant helping companies build strong cultures and talent pipelines.", expertise: ["HR", "Talent Acquisition", "Culture"], companyName: "Vasquez HR Consulting", title: "Lead Consultant", phone: "555-0111", website: "", state: "CO", industry: "Consulting", specialties: ["Recruitment", "Employee Engagement"], photoUrl: "/avatars/elena.jpg", videoUrl: "" },
    { userId: "u_m5", bio: "General contractor specializing in commercial construction in the mid-Atlantic region.", expertise: ["Construction", "Project Management", "Bidding"], companyName: "Deluca Construction", title: "Owner", phone: "555-0112", website: "", state: "PA", industry: "Construction", specialties: ["Commercial Build-out", "Renovation"], photoUrl: "/avatars/frank.jpg", videoUrl: "" },
    { userId: "u_m6", bio: "Digital marketing specialist with a focus on B2B lead generation.", expertise: ["Digital Marketing", "SEO", "Lead Generation"], companyName: "Park Digital", title: "Director", phone: "555-0113", website: "", state: "CA", industry: "Marketing", specialties: ["B2B Marketing", "Content Strategy"], photoUrl: "/avatars/grace.jpg", videoUrl: "" },
    { userId: "u_m7", bio: "Wealth management advisor serving high-net-worth individuals and families.", expertise: ["Wealth Management", "Investments", "Estate Planning"], companyName: "Blackwell Wealth", title: "Financial Advisor", phone: "555-0114", website: "", state: "NY", industry: "Finance", specialties: ["Portfolio Management", "Tax Strategy"], photoUrl: "/avatars/henry.jpg", videoUrl: "" },
    { userId: "u_m8", bio: "Bilingual attorney focused on immigration and employment law.", expertise: ["Immigration Law", "Employment Law", "Compliance"], companyName: "Reyes Law Group", title: "Managing Attorney", phone: "555-0115", website: "", state: "FL", industry: "Legal", specialties: ["Work Visas", "Employment Contracts"], photoUrl: "/avatars/isabel.jpg", videoUrl: "" },
    { userId: "u_m9", bio: "Pharma executive with 12 years in clinical operations and business development.", expertise: ["Pharmaceuticals", "Clinical Ops", "Business Dev"], companyName: "Patel BioPharma", title: "VP Business Development", phone: "555-0116", website: "", state: "NJ", industry: "Healthcare", specialties: ["Clinical Trials", "Licensing"], photoUrl: "/avatars/jason.jpg", videoUrl: "" },
    { userId: "u_m10", bio: "Educational technology entrepreneur improving outcomes for underserved schools.", expertise: ["EdTech", "Education", "Non-Profit"], companyName: "Mitchell Learning Co", title: "CEO & Founder", phone: "555-0117", website: "", state: "OH", industry: "Education", specialties: ["K-12 Technology", "Curriculum Development"], photoUrl: "/avatars/karen.jpg", videoUrl: "" },
    { userId: "u_m11", bio: "Supply chain consultant helping Fortune 500 companies reduce costs.", expertise: ["Supply Chain", "Operations", "Procurement"], companyName: "Foster Supply Co", title: "Managing Director", phone: "555-0118", website: "", state: "MI", industry: "Consulting", specialties: ["Logistics Optimization", "Vendor Management"], photoUrl: "/avatars/leon.jpg", videoUrl: "" },
    { userId: "u_m12", bio: "Hospitality industry veteran. Own and operate 3 boutique hotels.", expertise: ["Hospitality", "Operations", "Branding"], companyName: "Thornton Hotels", title: "Owner & Operator", phone: "555-0119", website: "", state: "TN", industry: "Hospitality", specialties: ["Hotel Management", "Guest Experience"], photoUrl: "/avatars/maya.jpg", videoUrl: "" },
    { userId: "u_m13", bio: "Energy sector executive with expertise in renewable energy development.", expertise: ["Renewable Energy", "Project Finance", "Policy"], companyName: "Griffin Energy Group", title: "Principal", phone: "555-0120", website: "", state: "CO", industry: "Energy", specialties: ["Solar Development", "Energy Policy"], photoUrl: "/avatars/noah.jpg", videoUrl: "" },
    { userId: "u_m14", bio: "Media and entertainment consultant focused on content strategy and monetization.", expertise: ["Media", "Content Strategy", "Monetization"], companyName: "Banks Media Group", title: "Principal Consultant", phone: "555-0121", website: "", state: "CA", industry: "Media", specialties: ["Streaming", "Brand Partnerships"], photoUrl: "/avatars/olivia.jpg", videoUrl: "" },
    { userId: "u_m15", bio: "Agricultural business owner. Third generation farmer expanding to agri-tech.", expertise: ["Agriculture", "AgriTech", "Business Dev"], companyName: "Sullivan Farms LLC", title: "President", phone: "555-0122", website: "", state: "IA", industry: "Agriculture", specialties: ["Precision Farming", "Food Supply Chain"], photoUrl: "/avatars/peter.jpg", videoUrl: "" },
  ];

  const events: Event[] = [
    { id: "ev1", title: "National EPG Summit 2026", description: "Annual gathering of Executive Partners from all 50 states. Keynotes, workshops, and networking.", location: "New York, NY", start: future(30), end: future(32), chapter: "National", createdBy: "u_admin", attendees: ["u_admin", "u_exec1", "u_exec2", "u_cl1", "u_cl2", "u_m1", "u_m3"] },
    { id: "ev2", title: "California Chapter Mixer", description: "Quarterly networking event for California-based EPG members. Rooftop social with speakers.", location: "Los Angeles, CA", start: future(10), end: future(10), chapter: "California", createdBy: "u_cl1", attendees: ["u_cl1", "u_exec1", "u_m1", "u_m6", "u_m14"] },
    { id: "ev3", title: "Texas Business Growth Workshop", description: "Half-day workshop on scaling businesses in the current economic climate.", location: "Houston, TX", start: future(15), end: future(15), chapter: "Texas", createdBy: "u_cl2", attendees: ["u_cl2", "u_exec2", "u_m3"] },
    { id: "ev4", title: "Midwest Healthcare Roundtable", description: "Discussion panel on healthcare business trends and opportunities.", location: "Chicago, IL", start: future(20), end: future(20), chapter: "Midwest", createdBy: "u_cl3", attendees: ["u_cl3", "u_m9", "u_m10"] },
    { id: "ev5", title: "Southeast Entrepreneurs Forum", description: "Pitch sessions and investor introductions for southeast region members.", location: "Miami, FL", start: future(25), end: future(25), chapter: "Southeast", createdBy: "u_cl5", attendees: ["u_cl5", "u_m8", "u_m12"] },
    { id: "ev6", title: "EPG Leadership Development Retreat", description: "Exclusive retreat for chapter leaders and executives. Strategy, leadership, and alignment.", location: "Asheville, NC", start: future(45), end: future(47), chapter: "National", createdBy: "u_admin", attendees: ["u_admin", "u_exec1", "u_exec2", "u_cl1", "u_cl2", "u_cl3", "u_cl4", "u_cl5"] },
  ];

  const referrals: Referral[] = [
    { id: "ref1", userId: "u_m1", title: "Seeking Commercial Real Estate Broker – Seattle Area", description: "Looking for a trusted EPG member who can help us find 10,000 sq ft of office space in Seattle or Bellevue.", industry: "Real Estate", state: "WA", status: "open", responses: [{ id: "rr1", userId: "u_m3", message: "Happy to connect you with my contact in Seattle. I cover the Pacific Northwest network. DM me.", createdAt: d(3) }], createdAt: d(7) },
    { id: "ref2", userId: "u_m4", title: "Need HR Software Recommendation for 50-Person Company", description: "Our client is rapidly growing and needs an HRIS solution. Looking for firsthand experience.", industry: "Technology", state: "CO", status: "open", responses: [], createdAt: d(5) },
    { id: "ref3", userId: "u_m7", title: "Looking for Business Attorney – M&A Experience", description: "Advising a client on a $5M acquisition. Need a corporate attorney who has done deals of this size.", industry: "Legal", state: "NY", status: "open", responses: [{ id: "rr2", userId: "u_cl4", message: "This is exactly our specialty. Send me the details and I can do a quick assessment.", createdAt: d(2) }], createdAt: d(6) },
    { id: "ref4", userId: "u_cl2", title: "Insurance for a new cannabis dispensary in Texas", description: "Client needs general liability and product liability coverage. Very specific regulatory requirements.", industry: "Insurance", state: "TX", status: "open", responses: [], createdAt: d(4) },
    { id: "ref5", userId: "u_m9", title: "Pharma Distribution Partner Needed – East Coast", description: "Need a licensed distributor to handle last-mile delivery of pharmaceutical products in NJ and surrounding states.", industry: "Healthcare", state: "NJ", status: "open", responses: [{ id: "rr3", userId: "u_m2", message: "I have a client in medical distribution. Let me make an introduction.", createdAt: d(1) }], createdAt: d(8) },
    { id: "ref6", userId: "u_m13", title: "Renewable Energy Project Financing – Colorado", description: "Seeking a lender or equity partner for a 5MW solar project. Have permits, need capital.", industry: "Energy", state: "CO", status: "open", responses: [], createdAt: d(3) },
    { id: "ref7", userId: "u_m5", title: "Subcontractor for Commercial Flooring – Philadelphia", description: "Need a reliable flooring subcontractor for a 20,000 sqft commercial renovation starting next month.", industry: "Construction", state: "PA", status: "open", responses: [], createdAt: d(9) },
    { id: "ref8", userId: "u_m10", title: "Grant Writer for EdTech Non-Profit", description: "Looking for an experienced grant writer familiar with DOE and private foundation grants for education.", industry: "Education", state: "OH", status: "fulfilled", responses: [{ id: "rr4", userId: "u_m14", message: "Reached out to a colleague. She specializes in this. Connecting you both offline.", createdAt: d(15) }], createdAt: d(20) },
    { id: "ref9", userId: "u_m12", title: "Hotel Furniture Supplier – Bulk Order", description: "Renovating 2 properties and need a quality furniture supplier with experience in boutique hotel setups.", industry: "Hospitality", state: "TN", status: "open", responses: [], createdAt: d(2) },
    { id: "ref10", userId: "u_m11", title: "Procurement Audit Consultant Needed", description: "Client needs a 2-week procurement audit. Looking for someone with Fortune 500 experience.", industry: "Consulting", state: "MI", status: "open", responses: [], createdAt: d(1) },
  ];

  const resources: Resource[] = [
    { id: "res1", title: "EPG Member Handbook 2026", description: "Complete guide to EPG membership, expectations, and benefits.", category: "guidelines", fileUrl: "/resources/epg-handbook-2026.pdf", uploadedBy: "u_admin", createdAt: d(90) },
    { id: "res2", title: "New Member Application Form", description: "Official application form for prospective EPG members.", category: "forms", fileUrl: "/resources/new-member-application.pdf", uploadedBy: "u_admin", createdAt: d(85) },
    { id: "res3", title: "Code of Professional Conduct", description: "Standards and expectations for all EPG members.", category: "compliance", fileUrl: "/resources/code-of-conduct.pdf", uploadedBy: "u_admin", createdAt: d(80) },
    { id: "res4", title: "Referral Best Practices Guide", description: "How to make high-quality, effective referrals within EPG.", category: "training", fileUrl: "/resources/referral-guide.pdf", uploadedBy: "u_exec1", createdAt: d(60) },
    { id: "res5", title: "Chapter Leader Operations Manual", description: "Step-by-step guide for chapter leaders on running local operations.", category: "chapter_docs", fileUrl: "/resources/chapter-ops-manual.pdf", uploadedBy: "u_admin", createdAt: d(55) },
    { id: "res6", title: "Annual Dues and Fee Schedule", description: "Current dues structure, fee schedule, and payment procedures.", category: "forms", fileUrl: "/resources/dues-schedule.pdf", uploadedBy: "u_admin", createdAt: d(50) },
    { id: "res7", title: "Networking Event Planning Template", description: "Template and checklist for planning EPG chapter events.", category: "chapter_docs", fileUrl: "/resources/event-planning-template.pdf", uploadedBy: "u_cl1", createdAt: d(40) },
    { id: "res8", title: "Business Ethics Training Module", description: "Online training module on ethical business practices for EPG members.", category: "training", fileUrl: "/resources/ethics-training.pdf", uploadedBy: "u_exec2", createdAt: d(30) },
  ];

  const announcements: Announcement[] = [
    { id: "ann1", title: "Welcome to EPG's Digital Platform!", body: "We are thrilled to launch the official EPG app. This platform is designed to bring our nationwide network together. Explore all features and connect with fellow executives across all 50 states.", createdBy: "u_admin", createdAt: d(5) },
    { id: "ann2", title: "National Summit Registration Now Open", body: "Registration for the 2026 National EPG Summit is now open. Early bird pricing ends in 2 weeks. All members are encouraged to attend this milestone event.", createdBy: "u_exec1", createdAt: d(8) },
    { id: "ann3", title: "New Chapter Leaders Appointed", body: "Please join us in welcoming our new chapter leaders: Sarah Nguyen (California), Carlos Mendez (Texas), Priya Sharma (Midwest), James O'Brien (Northeast), and Michelle Torres (Southeast).", createdBy: "u_admin", createdAt: d(15) },
    { id: "ann4", title: "Referral Exchange Milestone: 500 Connections Made", body: "Our members have now facilitated over 500 business referrals through the EPG network. This is a testament to the power of our community.", createdBy: "u_exec2", createdAt: d(20) },
    { id: "ann5", title: "Updated Code of Professional Conduct", body: "We have updated our Code of Professional Conduct. All members are required to review the updated document available in the Resources section.", createdBy: "u_admin", createdAt: d(30) },
  ];

  const leadership: LeadershipMember[] = [
    { id: "ldr1", name: "Marcus Webb", role: "Executive Director", bio: "Marcus founded EPG with a vision to create the most impactful executive network in the United States. With 25 years in business leadership, he has built EPG into a 1,000+ member organization.", photoUrl: "/avatars/marcus.jpg", order: 1 },
    { id: "ldr2", name: "Diana Holloway", role: "Chief Executive Officer", bio: "Diana oversees all operational and strategic initiatives for EPG. A veteran of venture capital and finance, she brings world-class leadership to the organization.", photoUrl: "/avatars/diana.jpg", order: 2 },
    { id: "ldr3", name: "Raymond Osei", role: "Chief Technology Officer", bio: "Raymond leads EPG's digital transformation and technology strategy. Serial entrepreneur with three successful exits.", photoUrl: "/avatars/raymond.jpg", order: 3 },
    { id: "ldr4", name: "Sarah Nguyen", role: "VP of Chapter Development", bio: "Sarah oversees EPG's 50-state chapter network, ensuring consistent quality and engagement across all regions.", photoUrl: "/avatars/sarah.jpg", order: 4 },
    { id: "ldr5", name: "Carlos Mendez", role: "VP of Member Services", bio: "Carlos leads member experience, onboarding, and retention programs. His team ensures every EPG member gets maximum value from the network.", photoUrl: "/avatars/carlos.jpg", order: 5 },
  ];

  const feedPosts: FeedPost[] = [
    { id: "fp1", authorId: "u_m2", title: "Just closed my biggest deal of the year!", body: "Grateful for the EPG network. A referral from a fellow member led to a $2M tax planning engagement. This community is real. 🙏", likedBy: ["u_admin", "u_exec1", "u_m1", "u_m5", "u_m7"], hidden: false, createdAt: d(3) },
    { id: "fp2", authorId: "u_cl1", body: "Reminder: California Chapter Mixer is coming up in 10 days! If you're in the LA/SF area, RSVP on the Events page. Spots are limited.", likedBy: ["u_exec1", "u_m6", "u_m14"], hidden: false, createdAt: d(5) },
    { id: "fp3", authorId: "u_exec2", title: "Thought Leadership: The Future of B2B Networking", body: "Traditional trade associations are dying. The future belongs to curated, high-trust networks where every member is accountable. That's why EPG exists. Share your thoughts below.", likedBy: ["u_admin", "u_exec1", "u_cl1", "u_cl2", "u_m1", "u_m9"], hidden: false, createdAt: d(7) },
  ];

  const thread1Id = canonicalThreadId("u_m1", "u_cl1");
  const thread2Id = canonicalThreadId("u_m7", "u_cl4");

  const threads: MessageThread[] = [
    {
      id: thread1Id,
      participantIds: ["u_m1", "u_cl1"],
      messages: [
        { id: "msg1", senderId: "u_cl1", body: "Hey Alex, great to connect at the summit! Would love to chat about your logistics platform.", createdAt: d(10) },
        { id: "msg2", senderId: "u_m1", body: "Thanks Sarah! Yes, definitely. Are you free next week for a quick call?", createdAt: d(9) },
        { id: "msg3", senderId: "u_cl1", body: "Tuesday at 2pm PST works perfectly.", createdAt: d(9) },
      ],
    },
    {
      id: thread2Id,
      participantIds: ["u_m7", "u_cl4"],
      messages: [
        { id: "msg4", senderId: "u_m7", body: "James, I saw your response on my referral post. Can you share your firm's experience with M&A under $10M?", createdAt: d(5) },
        { id: "msg5", senderId: "u_cl4", body: "Absolutely. We've handled over 40 deals in the $2M–$15M range. Let me send you our deal sheet.", createdAt: d(4) },
      ],
    },
  ];

  const meetingRequests: MeetingRequest[] = [
    { id: "mr1", fromUserId: "u_m9", toUserId: "u_m2", proposedTime: future(5), meetingType: "zoom", notes: "Want to discuss potential collaboration on a pharma client who needs accounting support.", zoomUrl: "https://zoom.us/j/demo123", status: "pending" },
    { id: "mr2", fromUserId: "u_cl3", toUserId: "u_m10", proposedTime: future(3), meetingType: "google_meet", notes: "Let's explore a partnership between your EdTech company and my healthcare IT consulting work.", meetUrl: "https://meet.google.com/demo-abc", status: "accepted" },
    { id: "mr3", fromUserId: "u_m7", toUserId: "u_cl4", proposedTime: future(7), meetingType: "phone", notes: "Follow-up on the M&A referral discussion.", status: "pending" },
  ];

  return {
    version: SEED_VERSION,
    sessionUserId: null,
    users,
    profiles,
    events,
    referrals,
    resources,
    resourceDownloads: [],
    announcements,
    leadership,
    threads,
    meetingRequests,
    feedPosts,
    notifications: [],
  };
}
