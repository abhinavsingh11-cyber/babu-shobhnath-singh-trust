import { storage } from "./storage";

export async function seedDatabase() {
  console.log("Seeding database with initial content...");

  try {
    const existingEvents = await storage.getAllEvents();
    if (existingEvents.length > 0) {
      console.log("Database already seeded, skipping...");
      return;
    }

    // Seed events
    await storage.createEvent({
      title: "Kavi Sammelan 2024",
      titleHi: "कवि सम्मेलन 2024",
      description: "Join us for an evening of poetry and literature featuring renowned poets from across India. Experience the beauty of Hindi and Urdu poetry in a cultural celebration.",
      descriptionHi: "भारत भर के प्रसिद्ध कवियों को प्रस्तुत करने वाली कविता और साहित्य की एक शाम में हमसे जुड़ें। सांस्कृतिक उत्सव में हिंदी और उर्दू कविता की सुंदरता का अनुभव करें।",
      category: "literature",
      date: "March 15, 2024",
      location: "Mumbai, Maharashtra",
      locationHi: "मुंबई, महाराष्ट्र",
      imageUrl: "/attached_assets/generated_images/Traditional_cultural_performance_stage_b31cfc84.png",
      published: true,
      createdBy: null,
    });

    await storage.createEvent({
      title: "Education Charity Drive",
      titleHi: "शिक्षा दान अभियान",
      description: "Distributing books and educational materials to rural schools. Help us empower young minds with the gift of knowledge and education.",
      descriptionHi: "ग्रामीण स्कूलों में किताबें और शैक्षिक सामग्री वितरित करना। ज्ञान और शिक्षा के उपहार से युवा मन को सशक्त बनाने में हमारी मदद करें।",
      category: "education",
      date: "March 20, 2024",
      location: "Pune, Maharashtra",
      locationHi: "पुणे, महाराष्ट्र",
      imageUrl: "/attached_assets/generated_images/Education_charity_event_volunteers_2c391d9a.png",
      published: true,
      createdBy: null,
    });

    await storage.createEvent({
      title: "Community Reading Session",
      titleHi: "सामुदायिक पठन सत्र",
      description: "Interactive reading and discussion sessions for all age groups. Share stories, discuss literature, and build community connections.",
      descriptionHi: "सभी आयु समूहों के लिए इंटरैक्टिव रीडिंग और चर्चा सत्र। कहानियां साझा करें, साहित्य पर चर्चा करें और सामुदायिक संबंध बनाएं।",
      category: "culture",
      date: "March 25, 2024",
      location: "Delhi",
      locationHi: "दिल्ली",
      imageUrl: "/attached_assets/generated_images/Community_reading_poetry_session_b590e330.png",
      published: true,
      createdBy: null,
    });

    // Seed blogs
    await storage.createBlog({
      title: "Preserving Regional Languages Through Literature",
      titleHi: "साहित्य के माध्यम से क्षेत्रीय भाषाओं का संरक्षण",
      content: "In an era of globalization, regional languages face the challenge of preservation. Literature serves as a powerful tool to keep these languages alive for future generations. Through poetry, stories, and cultural narratives, we can maintain the rich linguistic diversity of our nation.",
      contentHi: "वैश्वीकरण के युग में, क्षेत्रीय भाषाओं को संरक्षण की चुनौती का सामना करना पड़ता है। साहित्य भविष्य की पीढ़ियों के लिए इन भाषाओं को जीवित रखने के लिए एक शक्तिशाली उपकरण के रूप में कार्य करता है।",
      excerpt: "How literature and education play crucial roles in keeping regional languages alive for future generations.",
      excerptHi: "साहित्य और शिक्षा भविष्य की पीढ़ियों के लिए क्षेत्रीय भाषाओं को जीवित रखने में कैसे महत्वपूर्ण भूमिका निभाते हैं।",
      category: "education",
      imageUrl: "/attached_assets/generated_images/Trust_community_center_building_2bd8a9df.png",
      author: "Dr. Rajesh Kumar",
      published: true,
      createdBy: null,
    });

    // Seed poetry
    await storage.createPoetry({
      title: "Ek Nayi Subah",
      titleHi: "एक नई सुबह",
      content: "Suraj ki pehli kiran ke saath,\nUmmeedon ka naya savera aata hai,\nAndheron ko pichhe chhodkar,\nUjale ka sansar banata hai.",
      contentHi: "सूरज की पहली किरण के साथ,\nउम्मीदों का नया सवेरा आता है,\nअंधेरों को पीछे छोड़कर,\nउजाले का संसार बनाता है।",
      excerpt: "Suraj ki pehli kiran ke saath, ummeedon ka naya savera aata hai...",
      excerptHi: "सूरज की पहली किरण के साथ, उम्मीदों का नया सवेरा आता है...",
      author: "Kavita Sharma",
      authorHi: "कविता शर्मा",
      imageUrl: "/attached_assets/generated_images/Hindi_poetry_book_close-up_703df6eb.png",
      published: true,
      createdBy: null,
    });

    await storage.createPoetry({
      title: "Mitti Ki Khushboo",
      titleHi: "मिट्टी की खुशबू",
      content: "Barish ke baad ki mitti,\nYaadein taaza kar jaati hai,\nBachpan ke din yaad aate,\nDil ko sukoon de jaati hai.",
      contentHi: "बारिश के बाद की मिट्टी,\nयादें ताज़ा कर जाती है,\nबचपन के दिन याद आते,\nदिल को सुकून दे जाती है।",
      excerpt: "Barish ke baad ki mitti, yaadein taaza kar jaati hai...",
      excerptHi: "बारिश के बाद की मिट्टी, यादें ताज़ा कर जाती है...",
      author: "Amit Verma",
      authorHi: "अमित वर्मा",
      published: true,
      createdBy: null,
    });

    await storage.createPoetry({
      title: "Sapno Ka Safar",
      titleHi: "सपनों का सफर",
      content: "Raaston mein khoya ek musafir,\nApne sapno ko dhoondta,\nHar mod par naya dariya,\nNayi umang se bharta.",
      contentHi: "रास्तों में खोया एक मुसाफिर,\nअपने सपनों को ढूंढता,\nहर मोड़ पर नया दरिया,\nनई उमंग से भरता।",
      excerpt: "Raaston mein khoya ek musafir, apne sapno ko dhoondta...",
      excerptHi: "रास्तों में खोया एक मुसाफिर, अपने सपनों को ढूंढता...",
      author: "Priya Singh",
      authorHi: "प्रिया सिंह",
      published: true,
      createdBy: null,
    });

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}
