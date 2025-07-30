# धड़कन (DHADKAN) - स्वास्थ्य सेवा प्रबंधन प्रणाली

**भारत सरकार के लिए विकसित स्वास्थ्य सेवा वेब एप्लिकेशन**

## परियोजना विवरण

धड़कन एक comprehensive healthcare management system है जो भारत सरकार के स्वास्थ्य विभाग के लिए विकसित किया गया है। यह system role-based authentication के साथ administrators और doctors के लिए अलग-अलग dashboards प्रदान करता है।

## मुख्य विशेषताएं

### 🔐 Role-Based Authentication
- **प्रशासक (Admin)**: पूर्ण system control और management
- **चिकित्सक (Doctor)**: Patient management और medical records

### 📊 Admin Dashboard
- चिकित्सकों का प्रबंधन
- प्रशासकों का प्रबंधन  
- System reports और analytics
- Overall system oversight

### 🏥 Doctor Dashboard
- मरीज़ों की सूची और management
- Appointments का schedule और tracking
- Prescription management
- Medical records

### 🎨 Design Features
- **सरकारी थीम**: #FF9933 (भगवा) और #FFFFFF (सफेद) colors
- **Hindi Interface**: सभी content हिंदी में
- **Formal Design**: Government standards के अनुसार professional layout
- **Responsive**: Mobile और desktop दोनों के लिए optimized

## Technical Stack

- **Frontend**: Vite + React
- **Routing**: React Router DOM
- **Styling**: Pure CSS with government color scheme
- **Language**: Hindi (Devanagari script)

## Database Schema

### Admins Table
```sql
CREATE TABLE \`admins\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`name\` varchar(255) NOT NULL,
  \`email\` varchar(150) NOT NULL,
  \`password\` varchar(100) NOT NULL,
  \`role\` varchar(20) NOT NULL,
  \`created_at\` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`email\` (\`email\`)
)
```

### Doctors Table
```sql
CREATE TABLE \`doctors\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`doctorName\` varchar(100) NOT NULL,
  \`hospitalType\` varchar(120) DEFAULT NULL,
  \`hospitalname\` varchar(255) DEFAULT NULL,
  \`phoneNo\` varchar(10) NOT NULL,
  \`experience\` int(11) DEFAULT NULL,
  \`email\` varchar(150) NOT NULL,
  \`password\` varchar(255) NOT NULL,
  \`createdAt\` datetime DEFAULT NULL,
  \`updatedAt\` datetime DEFAULT NULL,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`email\` (\`email\`)
)
```

## Installation और Setup

1. **Dependencies Install करें:**
   ```bash
   npm install
   ```

2. **Development Server Start करें:**
   ```bash
   npm run dev
   ```

3. **Build for Production:**
   ```bash
   npm run build
   ```

## Usage

### Login Credentials (Demo)
- **Admin**: कोई भी valid email और password
- **Doctor**: कोई भी valid email और password

### Navigation
1. Login page पर role select करें (Admin/Doctor)
2. Valid credentials enter करें
3. Role के अनुसार appropriate dashboard पर redirect हो जाएंगे

## Project Structure

```
src/
├── components/
│   ├── Login.jsx              # Login page with role selection
│   ├── AdminDashboard.jsx     # Admin management interface
│   └── DoctorDashboard.jsx    # Doctor medical interface
├── App.jsx                    # Main app with routing
├── App.css                    # Government theme styles
├── index.css                  # Global styles
└── main.jsx                   # App entry point
```

## Government Compliance

- ✅ Hindi language interface
- ✅ Official color scheme (#FF9933, #FFFFFF)
- ✅ Formal, professional design
- ✅ Accessibility considerations
- ✅ Role-based security model

## Future Enhancements

- Backend API integration
- Real database connectivity
- Advanced reporting features
- Mobile app version
- Multi-language support
- Enhanced security features

## Support

यह application भारत सरकार के स्वास्थ्य विभाग के लिए विकसित की गई है। Technical support के लिए संबंधित IT विभाग से संपर्क करें।

---
**© 2025 धड़कन - स्वास्थ्य सेवा प्रबंधन प्रणाली | भारत सरकार**+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
