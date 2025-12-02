<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Admit Card - {{ $applicant->admission_roll }}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'DejaVu Sans', sans-serif; font-size: 12px; color: #333; }
        .card { border: 3px solid #1e40af; max-width: 600px; margin: 20px auto; }
        .header { background: linear-gradient(135deg, #1e40af, #3b82f6); color: white; padding: 20px; text-align: center; }
        .header h1 { font-size: 18px; margin-bottom: 5px; }
        .header h2 { font-size: 14px; font-weight: normal; }
        .admit-badge { background: #fbbf24; color: #1e40af; padding: 5px 20px; display: inline-block; font-weight: bold; margin-top: 10px; font-size: 16px; }
        .content { padding: 20px; }
        .photo-roll { display: table; width: 100%; margin-bottom: 20px; }
        .photo-box { display: table-cell; width: 120px; vertical-align: top; }
        .photo-box img { width: 100px; height: 120px; border: 2px solid #1e40af; object-fit: cover; }
        .roll-box { display: table-cell; vertical-align: middle; text-align: center; }
        .roll-number { font-size: 24px; font-weight: bold; color: #1e40af; }
        .roll-label { font-size: 12px; color: #666; }
        .info-section { margin-bottom: 15px; }
        .info-row { display: table; width: 100%; margin-bottom: 8px; }
        .info-label { display: table-cell; width: 40%; font-weight: bold; color: #555; }
        .info-value { display: table-cell; width: 60%; }
        .divider { border-top: 1px dashed #ccc; margin: 15px 0; }
        .exam-info { background: #f3f4f6; padding: 15px; margin-top: 15px; }
        .exam-info h3 { color: #1e40af; margin-bottom: 10px; font-size: 14px; }
        .signature-section { display: table; width: 100%; margin-top: 20px; }
        .signature-section > div { display: table-cell; width: 50%; text-align: center; }
        .signature-box { border-top: 1px solid #333; margin-top: 40px; padding-top: 5px; display: inline-block; min-width: 150px; }
        .candidate-signature img { height: 40px; margin-bottom: 5px; }
        .footer { background: #f3f4f6; padding: 10px; text-align: center; font-size: 10px; color: #666; }
        .instructions { margin-top: 20px; padding: 15px; border: 1px solid #fbbf24; background: #fffbeb; }
        .instructions h4 { color: #d97706; margin-bottom: 10px; }
        .instructions ul { margin-left: 20px; }
        .instructions li { margin-bottom: 5px; }
    </style>
</head>
<body>
    <div class="card">
        <div class="header">
            <h1>EXECUTIVE MBA PROGRAM</h1>
            <h2>{{ $session->session_name }} ({{ $session->year_start }}-{{ $session->year_end }})</h2>
            <div class="admit-badge">ADMIT CARD</div>
        </div>

        <div class="content">
            <div class="photo-roll">
                <div class="photo-box">
                    @if($applicant->photo_path)
                        <img src="{{ public_path('storage/' . $applicant->photo_path) }}" alt="Photo">
                    @else
                        <div style="width: 100px; height: 120px; border: 2px solid #1e40af; text-align: center; padding-top: 45px; color: #999;">Photo</div>
                    @endif
                </div>
                <div class="roll-box">
                    <div class="roll-label">ADMISSION ROLL</div>
                    <div class="roll-number">{{ $applicant->admission_roll }}</div>
                </div>
            </div>

            <div class="info-section">
                <div class="info-row"><span class="info-label">Candidate Name:</span><span class="info-value">{{ $applicant->full_name }}</span></div>
                <div class="info-row"><span class="info-label">Father's Name:</span><span class="info-value">{{ $applicant->fathers_name }}</span></div>
                <div class="info-row"><span class="info-label">Mother's Name:</span><span class="info-value">{{ $applicant->mothers_name }}</span></div>
                <div class="info-row"><span class="info-label">Subject Choice:</span><span class="info-value">{{ $applicant->subject_choice }}</span></div>
                <div class="info-row"><span class="info-label">Form No:</span><span class="info-value">{{ $applicant->form_no }}</span></div>
            </div>

            <div class="exam-info">
                <h3>Examination Information</h3>
                <div class="info-row"><span class="info-label">Exam Date:</span><span class="info-value">To Be Announced</span></div>
                <div class="info-row"><span class="info-label">Exam Time:</span><span class="info-value">To Be Announced</span></div>
                <div class="info-row"><span class="info-label">Venue:</span><span class="info-value">To Be Announced</span></div>
            </div>

            <div class="signature-section">
                <div class="candidate-signature">
                    @if($applicant->signature_path)
                        <img src="{{ public_path('storage/' . $applicant->signature_path) }}" alt="Signature">
                    @endif
                    <div class="signature-box">Candidate's Signature</div>
                </div>
                <div>
                    <div class="signature-box">Controller of Examination</div>
                </div>
            </div>

            <div class="instructions">
                <h4>Important Instructions:</h4>
                <ul>
                    <li>Bring this admit card along with a valid photo ID to the examination hall.</li>
                    <li>Arrive at the venue at least 30 minutes before the exam time.</li>
                    <li>Electronic devices including mobile phones are strictly prohibited.</li>
                    <li>Use only blue or black ballpoint pen for writing.</li>
                </ul>
            </div>
        </div>

        <div class="footer">
            <p>This is a computer-generated admit card. | Generated on {{ now()->format('d M, Y h:i A') }}</p>
        </div>
    </div>
</body>
</html>
