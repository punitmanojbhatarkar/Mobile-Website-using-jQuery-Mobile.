# Assignment 6: Mobile Website Using jQuery Mobile
**Course:** Full Stack Development (FSD) Lab  
**Project Title:** PulseCare Pro — Advanced Clinical Healthcare & Telehealth Mobile Web App  
**Student Name:** Punit Manoj Bhatarkar  

---

## 1. Project Overview & Unique Domain Selection
Unlike conventional food delivery or e-commerce clones, **PulseCare Pro** is an enterprise-grade mobile healthcare and telehealth platform designed for modern patient care. It features real-time health vitals tracking, an AI Clinical Symptom Triage engine, interactive consultation booking with dynamic date chips and time slots, digital QR boarding passes, a daily medication adherence tracker, and an animated live emergency ambulance GPS dispatch radar.

Built entirely on **jQuery Mobile 1.4.5**, it adheres to touch-first responsive principles, multi-page document architecture, and native-feeling mobile widgets.

---

## 2. Comprehensive jQuery Mobile Features & Widgets

| Feature / Widget | Implementation in PulseCare Pro | Technical Benefit |
|---|---|---|
| **Multi-Page Architecture (`data-role="page"`)** | 5 Linked Views (`#page-home`, `#page-doctors`, `#page-booking`, `#page-records`, `#page-emergency`) | Single-page document handling distinct patient views with hardware-accelerated slide transitions. |
| **Fixed Header & Quick Actions (`data-role="header"`)** | `data-position="fixed" data-tap-toggle="false"` | Sticky clinical top bar with back navigation, dark/light theme switcher, and direct booking shortcut. |
| **Persistent Bottom Navbars (`data-role="navbar"`)** | `data-role="footer" data-position="fixed"` | Five-tab persistent bottom bar with native icons across all pages (`Home`, `Doctors`, `Book Appt`, `Records`, `SOS`). |
| **Filterable Search Listviews (`data-role="listview"`)** | `data-filter="true" data-filter-placeholder="..."` | Real-time client-side search for doctors by name, specialty, or affiliated medical center. |
| **Slide-Out Side Panel (`data-role="panel"`)** | `<div data-role="panel" id="patient-panel">` | Drawer displaying patient health ID, blood group, allergies, primary care center, and dark mode toggle. |
| **AI Symptom Triage Popup (`data-role="popup"`)** | `#popup-symptom-checker` | Interactive symptom matching popup with real-time severity rating (High, Moderate, Routine) and 1-tap doctor routing. |
| **Doctor Credentials Modal (`data-role="popup"`)** | `#popup-doctor-details` | Specialist bio modal with qualifications, affiliated hospital, consultation fee, and direct booking button. |
| **Digital QR Boarding Pass Modal (`data-role="popup"`)** | `#popup-appointment-success` | Clinical consultation boarding pass with patient details, token `#MED-8492`, SVG QR code, and barcode. |
| **Flipswitch Widget (`data-role="flipswitch"`)** | `<select data-role="flipswitch">` | Smooth toggle between "In-Clinic 🏥" and "Video Call 📱" consultation with live surcharge recalculation. |
| **Range Slider Widget** | `<input type="range" data-highlight="true">` | Touch slider for Patient Age (1 to 95 years) with visual track highlight. |
| **Grouped Controls (`data-role="controlgroup"`)** | `<fieldset data-role="controlgroup">` | Radio button group for Insurance Scheme (StarCare Co-Pay, Student Wellness Discount, Self-Pay). |
| **Collapsible Accordions (`data-role="collapsibleset"`)** | `<div data-role="collapsibleset">` | Medical vault for Active Prescriptions, Diagnostic Lab Reports, and Immunization Passport. |
| **Daily Health Trackers** | Medication adherence progress bar + Hydration goal tracker | Interactive checklist and `+250ml` water intake counter with animated progress bar. |
| **Ambulance Live Radar** | Simulated GPS radar dispatch card | Real-time countdown timer, vehicle speed tracker (`52 km/h`), and siren indicator. |
| **Touch Gesture Navigation** | `swipeleft` and `swiperight` | Native mobile touch gestures hooked to `:mobile-pagecontainer` for fluid page transitions. |

---

## 3. Project File Structure
```
assignment 6/
│
├── index.html               # Multi-page jQuery Mobile healthcare application
├── server.js                # Zero-dependency Node.js HTTP server (port 8080)
├── package.json             # NPM metadata and start script
├── README.md                # Lab documentation & viva Q&A
│
├── css/
│   └── custom.css           # Healthcare styling, phone frame, QR pass & dark mode
│
├── js/
│   └── app.js               # Triage engine, billing calculator, QR pass, radar & swipe gestures
│
├── vendor/
│   ├── jquery.min.js        # jQuery Core v1.11.3 (offline standalone)
│   ├── jquery.mobile.min.css# jQuery Mobile Theme & Structure CSS v1.4.5
│   └── jquery.mobile.min.js # jQuery Mobile UI library v1.4.5
│
└── images/                  # High-resolution specialist portraits
    ├── doc1.jpg             # Dr. Marcus Vance (Cardiology)
    ├── doc2.jpg             # Dr. Elena Rostova (Pediatrics)
    ├── doc3.jpg             # Dr. Julian Thorne (Neurology)
    ├── doc4.jpg             # Dr. Sarah Jenkins (Orthopedics)
    ├── doc5.jpg             # Dr. Robert Chen (Dermatology)
    └── doc6.jpg             # Dr. Ananya Sharma (General Medicine)
```

---

## 4. How to Run Locally

### Option A: Using Node.js (Recommended)
1. Open PowerShell or Command Prompt in the `assignment 6` folder.
2. Run:
   ```bash
   node server.js
   ```
3. Open your browser and navigate to:
   ```
   http://localhost:8080
   ```

### Option B: Direct Offline File Launch
Because all vendor libraries (`jQuery` and `jQuery Mobile`) and doctor images are locally bundled within `vendor/` and `images/`, you can also double-click `index.html` directly in any web browser without needing an internet connection.

---

## 5. Main Code Section (For Assignment Submission PDF / Report)

### 5.1 Core HTML Structure (`index.html`)
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>PulseCare — Smart Health & Doctor Booking</title>
    <link rel="stylesheet" href="vendor/jquery.mobile.min.css">
    <link rel="stylesheet" href="css/custom.css">
    <script src="vendor/jquery.min.js"></script>
    <script src="vendor/jquery.mobile.min.js"></script>
</head>
<body>

    <!-- PAGE 1: PATIENT DASHBOARD & AI TRIAGE -->
    <div data-role="page" id="page-home" class="mobile-page">
        <!-- Patient Drawer Panel -->
        <div data-role="panel" id="patient-panel" data-display="overlay" data-theme="b">
            <h3>Punit Bhatarkar</h3>
            <p>Health ID: #PC-9042 • Blood: O+</p>
            <ul data-role="listview">
                <li><a href="#page-home">Dashboard</a></li>
                <li><a href="#page-doctors">Find Specialists</a></li>
                <li><a href="#page-booking">Book Appointment</a></li>
                <li><a href="#page-records">Medical Records</a></li>
                <li><a href="#page-emergency">Emergency SOS</a></li>
            </ul>
        </div>

        <!-- Sticky Header with Dark Mode Toggle -->
        <div data-role="header" data-position="fixed" data-tap-toggle="false">
            <a href="#patient-panel" class="ui-btn ui-icon-bars ui-btn-icon-notext">Menu</a>
            <h1>Pulse<span>Care</span> 🩺</h1>
            <button type="button" id="header-theme-toggle" class="ui-btn ui-btn-right ui-icon-gear ui-btn-icon-notext">Theme</button>
        </div>

        <!-- Main Content with Vitals & AI Symptom Card -->
        <div data-role="main" class="ui-content">
            <div class="welcome-card">
                <h2>Welcome back, Punit! 👋</h2>
                <div class="ui-grid-b vitals-grid">
                    <div class="ui-block-a">Pulse: <strong>72 bpm</strong></div>
                    <div class="ui-block-b">BP: <strong>120/80</strong></div>
                    <div class="ui-block-c">Sugar: <strong>95 mg/dL</strong></div>
                </div>
            </div>

            <!-- AI Health Triage Trigger Card -->
            <div class="symptom-checker-card">
                <h3>Feeling Unwell Today?</h3>
                <p>Select symptoms for instant clinical guidance.</p>
                <a href="#popup-symptom-checker" data-rel="popup" data-position-to="window" class="ui-btn ui-mini">Check Symptoms ➔</a>
            </div>

            <!-- Top Specialists Listview -->
            <ul data-role="listview" data-inset="true">
                <li>
                    <a href="#popup-doctor-details-home" data-rel="popup" data-position-to="window" class="doc-item-link"
                       data-id="1" data-name="Dr. Marcus Vance, MD" data-spec="Cardiovascular Surgery" data-fee="75" data-img="images/doc1.jpg">
                        <img src="images/doc1.jpg" alt="Doctor">
                        <h2>Dr. Marcus Vance, MD</h2>
                        <span class="ui-li-count">$75/visit</span>
                    </a>
                </li>
            </ul>
        </div>

        <!-- Persistent Bottom Navbar -->
        <div data-role="footer" data-position="fixed" data-tap-toggle="false">
            <div data-role="navbar">
                <ul>
                    <li><a href="#page-home" data-icon="home" class="ui-btn-active ui-state-persist">Home</a></li>
                    <li><a href="#page-doctors" data-icon="bullets">Doctors</a></li>
                    <li><a href="#page-booking" data-icon="calendar">Book Appt</a></li>
                    <li><a href="#page-records" data-icon="heart">Records</a></li>
                    <li><a href="#page-emergency" data-icon="alert">SOS</a></li>
                </ul>
            </div>
        </div>

        <!-- AI Symptom Triage Modal -->
        <div data-role="popup" id="popup-symptom-checker" data-overlay-theme="b" class="ui-content mobile-popup">
            <h3>AI Clinical Symptom Triage</h3>
            <div class="symptom-chips-container">
                <button type="button" class="symp-chip" data-spec="cardio" data-doc="Dr. Marcus Vance, MD">🫀 Chest Heaviness</button>
                <button type="button" class="symp-chip" data-spec="neuro" data-doc="Dr. Julian Thorne, PhD">🧠 Severe Migraine</button>
            </div>
            <div id="triage-result-box">
                <span id="triage-dot">🟢</span> Triage Level: <strong id="triage-level-text">Routine</strong>
            </div>
            <button type="button" id="triage-book-btn" class="ui-btn ui-btn-b">Book Suggested Doctor ➔</button>
        </div>
    </div>

    <!-- PAGE 2: INTERACTIVE APPOINTMENT BOOKING & QR PASS -->
    <div data-role="page" id="page-booking" class="mobile-page">
        <div data-role="header" data-position="fixed">
            <a href="#page-home" class="ui-btn ui-icon-arrow-l ui-btn-icon-notext">Back</a>
            <h1>Schedule <span>Visit</span></h1>
        </div>
        <div data-role="main" class="ui-content">
            <!-- Flipswitch Widget -->
            <div class="ui-field-contain">
                <label for="consult-mode-switch">Consultation Mode:</label>
                <select id="consult-mode-switch" data-role="flipswitch" data-theme="b">
                    <option value="telehealth">Video Call</option>
                    <option value="inclinic" selected>In-Clinic</option>
                </select>
            </div>

            <!-- Patient Age Slider -->
            <div class="ui-field-contain">
                <label for="patient-age-slider">Patient Age (Years):</label>
                <input type="range" id="patient-age-slider" value="21" min="1" max="95" step="1" data-highlight="true">
            </div>

            <!-- Date Chips & Time Slots -->
            <div class="date-chips-row">
                <button type="button" class="date-chip-btn active" data-date="Tomorrow, 16 Oct">Tomorrow 16 Oct</button>
                <button type="button" class="date-chip-btn" data-date="Fri, 17 Oct">Fri 17 Oct</button>
            </div>

            <button type="button" id="confirm-booking-btn" class="ui-btn ui-btn-b">Confirm Appointment ➔</button>
        </div>

        <!-- Digital Boarding Pass with SVG QR Code -->
        <div data-role="popup" id="popup-appointment-success" data-overlay-theme="b" class="ui-content mobile-popup">
            <h3>Appointment Confirmed!</h3>
            <div class="digital-boarding-pass">
                <span>PULSECARE CLINICAL PASS #MED-8492</span>
                <p id="pass-patient">Punit Bhatarkar</p>
                <p id="pass-doc">Dr. Marcus Vance, MD</p>
                <div class="pass-qr-wrap">
                    <!-- SVG QR Code -->
                    <svg viewBox="0 0 100 100" class="qr-svg-graphic"><rect width="100" height="100" fill="#fff"/></svg>
                </div>
            </div>
            <a href="#page-records" class="ui-btn ui-btn-b">View Medical Records</a>
        </div>
    </div>

    <script src="js/app.js"></script>
</body>
</html>
```

### 5.2 Application Logic & Event Handlers (`js/app.js`)
```javascript
$(document).on('pagecreate', function() {
    let currentDoctor = { id: 1, name: 'Dr. Marcus Vance, MD', fee: 75 };
    let selectedDate = 'Tomorrow, 16 Oct';
    let selectedTime = '02:30 PM';

    // Real-time co-pay & insurance calculations
    function updateBillCalculation() {
        const baseFee = currentDoctor.fee;
        const isTelehealth = $('#consult-mode-switch').val() === 'telehealth';
        const facilityFee = isTelehealth ? 0.00 : 10.00;
        const finalCopay = $('#ins-starcare').is(':checked') ? (isTelehealth ? 10.00 : 15.00) : (baseFee + facilityFee);
        $('#bill-total').text('$' + finalCopay.toFixed(2));
    }

    // AI Symptom Triage Selection
    $(document).on('click', '.symp-chip', function() {
        $('.symp-chip').removeClass('active');
        $(this).addClass('active');
        const spec = $(this).data('spec');
        const doc = $(this).data('doc');
        $('#triage-level-text').text(spec === 'cardio' ? 'High Priority' : 'Standard');
        $('#triage-book-btn').show().data('doc', doc);
    });

    // Touch Swipe Navigation
    $(document).on('swipeleft', '#page-home', function() {
        $(':mobile-pagecontainer').pagecontainer('change', '#page-doctors', { transition: 'slide' });
    });
    $(document).on('swiperight', '#page-doctors', function() {
        $(':mobile-pagecontainer').pagecontainer('change', '#page-home', { transition: 'slide', reverse: true });
    });

    // Medication & Water Tracker
    $('.med-toggle').on('change', function() {
        const percent = Math.round(($('.med-toggle:checked').length / $('.med-toggle').length) * 100);
        $('#med-progress-bar').css('width', percent + '%');
    });

    // Dark Mode Toggle
    $('#header-theme-toggle').on('click', function() {
        $('body').toggleClass('dark-mode');
    });
});
```

---

## 6. Viva Voce Questions & Answers (Full Marks Prep)

**Q1: What is jQuery Mobile and how is it different from standard jQuery?**  
*Answer:* Standard jQuery is a general DOM manipulation and event handling library, whereas jQuery Mobile is a specialized mobile-first HTML5 UI framework built on top of jQuery. It provides built-in mobile widgets (listviews, toolbars, popups, sliders), theme support, and touch events (`tap`, `swipeleft`, `swiperight`, `orientationchange`).

**Q2: What is the role of the `data-role` attribute in jQuery Mobile?**  
*Answer:* The `data-role` attribute is an HTML5 data attribute that instructs jQuery Mobile's widget initialization parser to transform semantic HTML elements into accessible, touch-friendly UI components (e.g. `data-role="page"`, `data-role="header"`, `data-role="navbar"`, `data-role="listview"`, `data-role="flipswitch"`).

**Q3: How does jQuery Mobile handle single-page multi-view navigation?**  
*Answer:* Multiple containers with `data-role="page"` exist in the same HTML file with unique IDs. When navigation links (e.g. `href="#page-booking"`) are clicked, jQuery Mobile utilizes AJAX transitions (such as `slide` or `fade`) to hide inactive pages and animate the target page into active view (`.ui-page-active`) without full page reloads.

**Q4: Why must `<div data-role="popup">` be placed inside `<div data-role="page">`?**  
*Answer:* In jQuery Mobile 1.4.5, popup widgets are scoped to their parent page's DOM lifecycle. Placing a popup outside a page container prevents jQuery Mobile from initializing its modal backdrop, position handlers, and `.ui-popup-hidden` state, leading to display bugs.

**Q5: How does the filterable listview function in jQuery Mobile?**  
*Answer:* By adding `data-filter="true"` to a `<ul data-role="listview">`, jQuery Mobile injects a search input above the list and filters the list items in real-time by matching user input against the text content of each item.
