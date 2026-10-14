/**
 * PULSECARE HEALTHCARE — jQuery Mobile Application Logic
 * FSD Assignment 6: Smart Healthcare & Doctor Booking Mobile App
 */

$(document).on('pagecreate', function() {
    // Current Selected Doctor State
    let currentDoctor = {
        id: 1,
        name: 'Dr. Marcus Vance, MD',
        spec: 'Cardiovascular Surgery',
        fee: 75,
        rating: 4.9,
        exp: '14 Years Exp',
        hosp: 'Metro Heart Institute',
        img: 'images/doc1.jpg'
    };

    let selectedDate = 'Tomorrow, 16 Oct';
    let selectedTime = '02:30 PM';
    let waterCurrentMl = 1750;
    const waterGoalMl = 2500;
    let radarTimerInterval = null;

    function formatMoney(amount) {
        return '$' + Math.max(0, amount).toFixed(2);
    }

    // --- 1. Real-time Appointment Billing Calculation ---
    function updateBillCalculation() {
        const baseFee = currentDoctor.fee;
        const isTelehealth = $('#consult-mode-switch').val() === 'telehealth';
        const facilityFee = isTelehealth ? 0.00 : 10.00;

        const insuranceType = $('input[name="insurance-type"]:checked').val();
        let discount = 0;
        let finalCopay = 0;

        if (insuranceType === 'starcare') {
            finalCopay = isTelehealth ? 10.00 : 15.00;
            discount = (baseFee + facilityFee) - finalCopay;
        } else if (insuranceType === 'student') {
            const gross = baseFee + facilityFee;
            discount = gross * 0.30;
            finalCopay = gross - discount;
        } else {
            discount = 0.00;
            finalCopay = baseFee + facilityFee;
        }

        $('#bill-base-fee').text(formatMoney(baseFee));
        $('#bill-facility').text(formatMoney(facilityFee));
        $('#bill-discount').text('-' + formatMoney(discount));
        $('#bill-total').text(formatMoney(finalCopay));
    }

    // --- 2. Doctor Inspection Popups ---
    $(document).on('click', '.doc-item-link', function() {
        const id = parseInt($(this).data('id'), 10);
        const name = $(this).data('name');
        const spec = $(this).data('spec');
        const exp = $(this).data('exp');
        const fee = parseFloat($(this).data('fee'));
        const rating = $(this).data('rating');
        const img = $(this).data('img');
        const hosp = $(this).data('hosp');

        currentDoctor = { id, name, spec, exp, fee, rating, img, hosp };

        $('.doc-popup-name').text(name);
        $('.doc-popup-spec').text(spec);
        $('.doc-popup-exp').text(exp);
        $('.doc-popup-rating').text(rating);
        $('.doc-popup-hosp').text(hosp);
        $('.doc-popup-fee').text('$' + fee);
        $('.doc-popup-img').attr('src', img);
    });

    $(document).on('click', '#popup-book-direct-home, #popup-book-direct-menu', function() {
        $('#booking-doc-name').text(currentDoctor.name);
        $('#booking-doc-spec').text(currentDoctor.spec + ' • $' + currentDoctor.fee + ' base fee');
        updateBillCalculation();
        $('#popup-doctor-details-home').popup('close');
        $('#popup-doctor-details-menu').popup('close');
    });

    // --- 3. Interactive Date & Time Slot Selection ---
    $(document).on('click', '.date-chip-btn', function() {
        $('.date-chip-btn').removeClass('active');
        $(this).addClass('active');
        selectedDate = $(this).data('date');
    });

    $(document).on('click', '.time-slot-btn', function() {
        $('.time-slot-btn').removeClass('active');
        $(this).addClass('active');
        selectedTime = $(this).data('time');
    });

    // Form change listeners
    $('#consult-mode-switch, input[name="insurance-type"]').on('change', function() {
        updateBillCalculation();
    });

    // --- 4. Category Filter Buttons on Directory Page ---
    $('.filter-btn').on('click', function(e) {
        e.preventDefault();
        $('.filter-btn').removeClass('ui-btn-active');
        $(this).addClass('ui-btn-active');

        const dept = $(this).data('dept');
        const $items = $('#full-doctor-listview li');

        if (dept === 'all') {
            $items.show();
        } else {
            $items.each(function() {
                if ($(this).data('dept') === dept) {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            });
        }
        $('#full-doctor-listview').listview('refresh');
    });

    $('.dept-card').on('click', function() {
        const dept = $(this).data('dept');
        setTimeout(() => {
            if (dept === 'cardiology') {
                $('a.filter-btn[data-dept="cardio"]').trigger('click');
            } else if (dept === 'pediatrics') {
                $('a.filter-btn[data-dept="pediatrics"]').trigger('click');
            } else if (dept === 'neurology') {
                $('a.filter-btn[data-dept="neuro"]').trigger('click');
            }
        }, 150);
    });

    // --- 5. AI Symptom Triage Interactive Matching ---
    $(document).on('click', '.symp-chip', function() {
        $('.symp-chip').removeClass('active');
        $(this).addClass('active');

        const specKey = $(this).data('spec');
        const docName = $(this).data('doc');

        let severity = 'Routine / Standard';
        let dot = '🟢';
        let advice = 'Recommended for outpatient clinical consultation.';

        if (specKey === 'cardio') {
            severity = 'High Priority';
            dot = '🔴';
            advice = 'Cardiovascular assessment advised within 24 hours.';
        } else if (specKey === 'neuro') {
            severity = 'Moderate';
            dot = '🟡';
            advice = 'Neurology review recommended to evaluate migraine etiology.';
        }

        $('#triage-dot').text(dot);
        $('#triage-level-text').text(severity);
        $('#triage-recommendation').text(advice);
        $('#triage-doctor-target').text(docName);
        $('#triage-matched-spec').show();
        $('#triage-book-btn').show().data('spec', specKey).data('doc', docName);
    });

    $('#triage-book-btn').on('click', function() {
        const docName = $(this).data('doc');
        $('#booking-doc-name').text(docName);
        $('#popup-symptom-checker').popup('close');
        setTimeout(() => {
            $(':mobile-pagecontainer').pagecontainer('change', '#page-booking', { transition: 'slide' });
        }, 200);
    });

    // --- 6. Confirm Appointment Action (Generates Boarding Pass) ---
    $('#confirm-booking-btn').on('click', function(e) {
        e.preventDefault();
        const patientName = $('#patient-name').val().trim() || 'Punit Bhatarkar';
        const mode = $('#consult-mode-switch').val() === 'telehealth' ? 'Tele-Health Video' : 'In-Clinic Consultation';

        $('#pass-patient').text(patientName);
        $('#pass-doc').text(currentDoctor.name);
        $('#pass-time').text(selectedDate + ', ' + selectedTime);
        $('#pass-mode').text(mode);

        $('#popup-appointment-success').popup('open', { positionTo: 'window', transition: 'pop' });
    });

    // --- 7. Daily Medication & Hydration Tracker ---
    $('.med-toggle').on('change', function() {
        const $label = $(this).closest('.med-item');
        if ($(this).is(':checked')) {
            $label.addClass('done');
        } else {
            $label.removeClass('done');
        }

        const totalMeds = $('.med-toggle').length;
        const checkedMeds = $('.med-toggle:checked').length;
        const percentage = Math.round((checkedMeds / totalMeds) * 100);

        $('#med-percent').text(percentage + '% Taken');
        $('#med-progress-bar').css('width', percentage + '%');
    });

    $('#water-add-btn').on('click', function() {
        waterCurrentMl = Math.min(waterGoalMl, waterCurrentMl + 250);
        const percent = Math.round((waterCurrentMl / waterGoalMl) * 100);
        $('#water-current').text(waterCurrentMl);
        $(this).text(`+250ml (${percent}%)`);
        if (waterCurrentMl >= waterGoalMl) {
            alert('🎉 Daily Hydration Goal of 2,500ml Achieved!');
        }
    });

    // --- 8. Emergency Ambulance Radar Dispatch Simulator ---
    $('#sos-dispatch-btn').on('click', function() {
        $('#sos-main-card').slideUp(200);
        $('#ambulance-radar-card').slideDown(250);

        let secondsRemaining = 342; // ~5 mins 42s
        if (radarTimerInterval) clearInterval(radarTimerInterval);

        radarTimerInterval = setInterval(() => {
            secondsRemaining--;
            if (secondsRemaining <= 0) {
                clearInterval(radarTimerInterval);
                $('#radar-timer').text('Arrived at Location');
                return;
            }
            const mins = Math.floor(secondsRemaining / 60);
            const secs = secondsRemaining % 60;
            $('#radar-timer').text(`${mins}:${secs < 10 ? '0' : ''}${secs}`);
        }, 1000);
    });

    // --- 9. Dark Mode Theme Toggle ---
    $('#header-theme-toggle, #panel-dark-toggle').on('click', function() {
        $('body').toggleClass('dark-mode');
        const isDark = $('body').hasClass('dark-mode');
        $('#header-theme-toggle').text(isDark ? '☀️' : '🌙');
        $('#panel-dark-toggle').text(isDark ? 'Light Mode ☀️' : 'Dark Mode 🌙');
    });

    // --- 10. Touch Gestures (Swipe Navigation) ---
    $(document).on('swipeleft', '#page-home', function() {
        $(':mobile-pagecontainer').pagecontainer('change', '#page-doctors', { transition: 'slide' });
    });
    $(document).on('swipeleft', '#page-doctors', function() {
        $(':mobile-pagecontainer').pagecontainer('change', '#page-booking', { transition: 'slide' });
    });
    $(document).on('swipeleft', '#page-booking', function() {
        $(':mobile-pagecontainer').pagecontainer('change', '#page-records', { transition: 'slide' });
    });
    $(document).on('swipeleft', '#page-records', function() {
        $(':mobile-pagecontainer').pagecontainer('change', '#page-emergency', { transition: 'slide' });
    });

    $(document).on('swiperight', '#page-emergency', function() {
        $(':mobile-pagecontainer').pagecontainer('change', '#page-records', { transition: 'slide', reverse: true });
    });
    $(document).on('swiperight', '#page-records', function() {
        $(':mobile-pagecontainer').pagecontainer('change', '#page-booking', { transition: 'slide', reverse: true });
    });
    $(document).on('swiperight', '#page-booking', function() {
        $(':mobile-pagecontainer').pagecontainer('change', '#page-doctors', { transition: 'slide', reverse: true });
    });
    $(document).on('swiperight', '#page-doctors', function() {
        $(':mobile-pagecontainer').pagecontainer('change', '#page-home', { transition: 'slide', reverse: true });
    });

    updateBillCalculation();
});
