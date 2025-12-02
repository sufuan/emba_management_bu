<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Application Form - {{ $applicant->form_no }}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'DejaVu Sans', sans-serif; font-size: 12px; line-height: 1.5; color: #333; }
        .container { padding: 20px; max-width: 800px; margin: 0 auto; }
        .header { text-align: center; border-bottom: 2px solid #1e40af; padding-bottom: 15px; margin-bottom: 20px; }
        .header h1 { font-size: 20px; color: #1e40af; margin-bottom: 5px; }
        .header h2 { font-size: 14px; color: #666; font-weight: normal; }
        .form-no { background: #1e40af; color: white; padding: 5px 15px; display: inline-block; margin-top: 10px; font-weight: bold; }
        .photo-section { float: right; width: 100px; height: 120px; border: 1px solid #ccc; text-align: center; }
        .photo-section img { width: 100%; height: 100%; object-fit: cover; }
        .section { margin-bottom: 20px; clear: both; }
        .section-title { background: #f3f4f6; padding: 8px 12px; font-weight: bold; color: #1e40af; border-left: 4px solid #1e40af; margin-bottom: 10px; }
        .row { display: table; width: 100%; margin-bottom: 8px; }
        .label { display: table-cell; width: 35%; font-weight: bold; color: #555; padding: 5px 0; }
        .value { display: table-cell; width: 65%; padding: 5px 0; border-bottom: 1px dotted #ccc; }
        .signature-box { width: 200px; height: 60px; border: 1px solid #ccc; margin-top: 10px; }
        .signature-box img { width: 100%; height: 100%; object-fit: contain; }
        .footer { margin-top: 30px; text-align: center; font-size: 10px; color: #666; border-top: 1px solid #ccc; padding-top: 10px; }
        .two-col { display: table; width: 100%; }
        .two-col > div { display: table-cell; width: 50%; vertical-align: top; padding-right: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>EXECUTIVE MBA ADMISSION FORM</h1>
            <h2>{{ $session->session_name }} ({{ $session->year_start }}-{{ $session->year_end }})</h2>
            <div class="form-no">Form No: {{ $applicant->form_no }}</div>
        </div>

        <div class="photo-section">
            @if($applicant->photo_path)
                <img src="{{ public_path('storage/' . $applicant->photo_path) }}" alt="Photo">
            @else
                <div style="padding-top: 40px; color: #999;">Photo</div>
            @endif
        </div>

        <div class="section">
            <div class="section-title">Personal Information</div>
            <div class="row"><span class="label">Full Name:</span><span class="value">{{ $applicant->full_name }}</span></div>
            <div class="row"><span class="label">Father's Name:</span><span class="value">{{ $applicant->fathers_name }}</span></div>
            <div class="row"><span class="label">Mother's Name:</span><span class="value">{{ $applicant->mothers_name }}</span></div>
            <div class="row"><span class="label">Date of Birth:</span><span class="value">{{ $applicant->dob?->format('d M, Y') }}</span></div>
            <div class="row"><span class="label">NID:</span><span class="value">{{ $applicant->nid }}</span></div>
        </div>

        <div class="section">
            <div class="section-title">Contact Information</div>
            <div class="row"><span class="label">Phone:</span><span class="value">{{ $applicant->phone }}</span></div>
            <div class="row"><span class="label">Email:</span><span class="value">{{ $applicant->email }}</span></div>
        </div>

        <div class="section">
            <div class="section-title">Academic Choice</div>
            <div class="row"><span class="label">Subject Choice:</span><span class="value">{{ $applicant->subject_choice }}</span></div>
            <div class="row"><span class="label">Admission Roll:</span><span class="value">{{ $applicant->admission_roll }}</span></div>
        </div>

        @if($applicant->education_json && count($applicant->education_json) > 0)
        <div class="section">
            <div class="section-title">Educational Background</div>
            @foreach($applicant->education_json as $edu)
            <div style="margin-bottom: 10px; padding: 8px; background: #f9fafb;">
                <strong>{{ $edu['degree'] ?? 'N/A' }}</strong> - {{ $edu['institution'] ?? 'N/A' }}<br>
                <small>Year: {{ $edu['year'] ?? 'N/A' }} | Result: {{ $edu['result'] ?? 'N/A' }}</small>
            </div>
            @endforeach
        </div>
        @endif

        @if($applicant->experience_json && count($applicant->experience_json) > 0)
        <div class="section">
            <div class="section-title">Work Experience</div>
            @foreach($applicant->experience_json as $exp)
            <div style="margin-bottom: 10px; padding: 8px; background: #f9fafb;">
                <strong>{{ $exp['position'] ?? 'N/A' }}</strong> at {{ $exp['company'] ?? 'N/A' }}<br>
                <small>Duration: {{ $exp['duration'] ?? 'N/A' }}</small>
            </div>
            @endforeach
        </div>
        @endif

        <div class="section">
            <div class="section-title">Declaration & Signature</div>
            <p style="margin-bottom: 15px;">I hereby declare that all the information provided above is true and correct to the best of my knowledge.</p>
            <div class="two-col">
                <div>
                    <strong>Applicant's Signature:</strong>
                    <div class="signature-box">
                        @if($applicant->signature_path)
                            <img src="{{ public_path('storage/' . $applicant->signature_path) }}" alt="Signature">
                        @endif
                    </div>
                </div>
                <div>
                    <strong>Date:</strong>
                    <div style="margin-top: 10px;">{{ $applicant->submitted_at?->format('d M, Y') }}</div>
                </div>
            </div>
        </div>

        <div class="footer">
            <p>Generated on {{ now()->format('d M, Y h:i A') }} | Application ID: {{ $applicant->form_no }}</p>
            <p>This is a computer-generated document. No signature is required.</p>
        </div>
    </div>
</body>
</html>
