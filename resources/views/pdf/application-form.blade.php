<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8" />
    <title>Application Form - {{ $applicant->form_no }}</title>
    <style>
        @page { size: A4; margin: 12mm 12mm 12mm 12mm; }
        body { font-family: sans-serif; font-size: 11.5px; line-height: 1.35; margin: 0; padding: 0; }
        .section-title { font-size: 14px; font-weight: bold; margin: 6px 0; text-align: center; border: 1px solid #000; padding: 4px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 8px; }
        table td, table th { border: 1px solid #000; padding: 4px 6px; font-size: 11px; }
        p { margin: 4px 0; }
        .page-break { page-break-before: always; }
        .compact-row { margin: 3px 0; font-size: 11.5px; }
        ul { margin: 6px 0 6px 20px; padding: 0; }
        li { margin: 3px 0; font-size: 11px; }
    </style>
</head>
<body>

    <!-- Header with Logo and Barcode -->
    <table style="border: none; margin-bottom: 10px;">
        <tr>
            <td style="border: none; width: 20%; text-align: center; vertical-align: top;">
                @if(file_exists(public_path('logo/university_logo.png')))
                    <img src="{{ public_path('logo/university_logo.png') }}" alt="Logo" style="width:65px; height:auto;">
                @endif
            </td>
            <td style="border: none; width: 60%; text-align: center; vertical-align: middle;">
                <div style="font-size: 18px; font-weight: bold;">DEPARTMENT OF MANAGEMENT</div>
                <div style="font-size: 12px; margin-top: 2px;">University of Barishal</div>
                <div style="font-size: 13px; font-weight: bold; margin-top: 4px;">Application Form for EMBA Admission</div>
                <div style="font-size: 11px; margin-top: 2px;">Session: {{ $session->session_name }}</div>
                <div style="margin-top: 5px;">
                    <img src="{{ $barcodeBase64 }}" style="width:85px; height:30px;" />
                </div>
            </td>
            <td style="border: none; width: 20%; text-align: center; vertical-align: top;">
                <div style="width: 80px; height: 100px; border: 1px solid #000; margin: 0 auto;">
                    @if($applicant->photo_path)
                        <img src="{{ public_path('storage/' . $applicant->photo_path) }}" style="width:100%; height:100%; object-fit:cover;" />
                    @else
                        <div style="font-size: 10px; padding-top: 40px;">Passport Photo</div>
                    @endif
                </div>
            </td>
        </tr>
    </table>

    <div class="section-title">APPLICANT COPY</div>
    <p style="text-align:center; margin-bottom:8px; font-size: 12px;"><strong>Form No: {{ $applicant->form_no }}</strong></p>

    <p class="compact-row"><strong>1. Full Name:</strong> {{ strtoupper($applicant->full_name) }}</p>
    <p class="compact-row"><strong>2. Father's Name:</strong> {{ $applicant->fathers_name }} | <strong>Mother's Name:</strong> {{ $applicant->mothers_name }} | <strong>DOB:</strong> {{ $applicant->dob?->format('d/m/Y') }} | <strong>NID:</strong> {{ $applicant->nid }}</p>
    <p class="compact-row"><strong>3. Present Address:</strong> {{ $applicant->present_address ?? 'N/A' }}</p>
    <p class="compact-row"><strong>4. Permanent Address:</strong> {{ $applicant->permanent_address ?? 'N/A' }}</p>
    <p class="compact-row"><strong>5. Mobile:</strong> {{ $applicant->phone }} | <strong>Email:</strong> {{ $applicant->email }}</p>

    <p class="compact-row" style="margin-top: 5px;"><strong>6. Educational Qualifications:</strong></p>
    <table>
        <thead>
            <tr>
                <th style="width:20%;">Examination</th>
                <th style="width:10%;">Year</th>
                <th style="width:30%;">Board / University</th>
                <th style="width:25%;">Subject / Dept.</th>
                <th style="width:15%;">Result</th>
            </tr>
        </thead>
        <tbody>
            @php
                $eduData = $applicant->education_json;
                $rows = [
                    ['key' => 'ssc', 'label' => 'SSC'],
                    ['key' => 'hsc', 'label' => 'HSC'],
                    ['key' => 'bachelor', 'label' => 'Bachelor (4 Yr)'],
                    ['key' => 'master', 'label' => 'Master'],
                ];
            @endphp
            @foreach($rows as $row)
                @php
                    $edu = $eduData[$row['key']] ?? [];
                    $board = $edu['board'] ?? $edu['university'] ?? '';
                    $subject = $edu['subject'] ?? $edu['department'] ?? '';
                    $year = $edu['year'] ?? '';
                    $result = $edu['result'] ?? '';
                    $isEmpty = empty($year) && empty($board) && empty($subject) && empty($result);
                @endphp
                @if($row['key'] !== 'master' || !$isEmpty)
                <tr>
                    <td>{{ $row['label'] }}</td>
                    <td>{{ $year }}</td>
                    <td>{{ $board }}</td>
                    <td>{{ $subject }}</td>
                    <td>{{ $result }}</td>
                </tr>
                @endif
            @endforeach
        </tbody>
    </table>

    <p class="compact-row"><strong>7. Job Experience:</strong>
    @php
        $hasExperience = false;
        $expList = [];
        if($applicant->experience_json && is_array($applicant->experience_json)) {
            foreach($applicant->experience_json as $exp) {
                if(!empty($exp['position']) || !empty($exp['company']) || !empty($exp['duration'])) {
                    $hasExperience = true;
                    $expList[] = ($exp['position'] ?? '') . ' at ' . ($exp['company'] ?? '') . ' (' . ($exp['duration'] ?? '') . ')';
                }
            }
        }
    @endphp
    {{ $hasExperience ? implode('; ', $expList) : 'N/A' }}
    </p>

    <p class="compact-row"><strong>8. Payment:</strong> Transaction ID: {{ $applicant->payment_transaction_id ?: 'N/A' }} | Method: {{ $applicant->payment_method ?: 'N/A' }} | Amount: {{ $applicant->payment_amount ? number_format($applicant->payment_amount, 2) . ' BDT' : 'N/A' }}</p>

    <p class="compact-row" style="margin-top: 10px;"><strong>Declaration:</strong> The information provided is true and correct. I accept that the University reserves the right to terminate my admission if any information is found false. I will abide by all rules and regulations of the University.</p>

    <table style="border: none; margin-top: 25px;">
        <tr>
            <td style="border: none; width: 70%;"></td>
            <td style="border: none; width: 30%; text-align: center;">
                ____________________<br>
                <strong style="font-size: 11px;">Signature of Applicant</strong><br>
                <span style="font-size: 10px;">Date: {{ $applicant->submitted_at?->format('d/m/Y') }}</span>
            </td>
        </tr>
    </table>

    <!-- PAGE 2: OFFICE COPY -->
    <div class="page-break"></div>

    <!-- Header for Page 2 -->
    <table style="border: none; margin-bottom: 10px;">
        <tr>
            <td style="border: none; width: 20%; text-align: center; vertical-align: top;">
                @if(file_exists(public_path('logo/university_logo.png')))
                    <img src="{{ public_path('logo/university_logo.png') }}" alt="Logo" style="width:65px; height:auto;">
                @endif
            </td>
            <td style="border: none; width: 60%; text-align: center; vertical-align: middle;">
                <div style="font-size: 18px; font-weight: bold;">DEPARTMENT OF MANAGEMENT</div>
                <div style="font-size: 12px; margin-top: 2px;">University of Barishal</div>
                <div style="font-size: 13px; font-weight: bold; margin-top: 4px;">EMBA Admission - Session: {{ $session->session_name }}</div>
                <div style="margin-top: 5px;">
                    <img src="{{ $barcodeBase64 }}" style="width:85px; height:30px;" />
                </div>
            </td>
            <td style="border: none; width: 20%; text-align: center; vertical-align: top;">
                <div style="width: 80px; height: 100px; border: 1px solid #000; margin: 0 auto;">
                    @if($applicant->photo_path)
                        <img src="{{ public_path('storage/' . $applicant->photo_path) }}" style="width:100%; height:100%; object-fit:cover;" />
                    @else
                        <div style="font-size: 10px; padding-top: 40px;">Passport Photo</div>
                    @endif
                </div>
            </td>
        </tr>
    </table>

    <div class="section-title">OFFICE COPY</div>

    <p class="compact-row" style="text-align:center; margin-bottom:8px; font-size: 12px;"><strong>Form No: {{ $applicant->form_no }}</strong></p>

    <table style="border:none; margin-bottom:8px;">
        <tr>
            <td style="border:none; width:50%; padding:4px 0;"><strong>Admission Roll:</strong> ______________________</td>
            <td style="border:none; width:50%; padding:4px 0;"><strong>Registration No:</strong> ______________________</td>
        </tr>
        <tr>
            <td style="border:none; width:50%; padding:4px 0;"><strong>Roll Number:</strong> ______________________</td>
            <td style="border:none; width:50%; padding:4px 0;"><strong>Date of Admission:</strong> ______________________</td>
        </tr>
        <tr>
            <td style="border:none; width:50%; padding:4px 0;"><strong>Merit Position:</strong> ______________________</td>
            <td style="border:none; width:50%; padding:4px 0;"></td>
        </tr>
    </table>

    <p class="compact-row"><strong>Applicant Name:</strong> {{ strtoupper($applicant->full_name) }}</p>
    <p class="compact-row"><strong>Father's Name:</strong> {{ $applicant->fathers_name }} | <strong>Mother's Name:</strong> {{ $applicant->mothers_name }}</p>
    <p class="compact-row"><strong>DOB:</strong> {{ $applicant->dob?->format('d/m/Y') }} | <strong>NID:</strong> {{ $applicant->nid }} | <strong>Mobile:</strong> {{ $applicant->phone }} | <strong>Email:</strong> {{ $applicant->email }}</p>
    <p class="compact-row"><strong>Present Address:</strong> {{ $applicant->present_address ?? 'N/A' }}</p>
    <p class="compact-row"><strong>Permanent Address:</strong> {{ $applicant->permanent_address ?? 'N/A' }}</p>

    <p class="compact-row" style="margin-top:6px;"><strong>Payment:</strong> TRX ID: {{ $applicant->payment_transaction_id ?: 'N/A' }} | Method: {{ $applicant->payment_method ?: 'N/A' }} | Amount: {{ $applicant->payment_amount ? number_format($applicant->payment_amount, 2) . ' BDT' : 'N/A' }}</p>

    <p class="compact-row" style="margin-top:10px;"><strong>Remarks:</strong></p>
    <div style="border:1px solid #000; height:60px; margin-bottom:12px;"></div>

    <table style="border:none; margin-top:20px;">
        <tr>
            <td style="border:none; text-align:center; width:33%;">
                ______________________<br>
                <span style="font-size:10px;"><strong>Scrutinizer</strong></span>
            </td>
            <td style="border:none; text-align:center; width:33%;">
                ______________________<br>
                <span style="font-size:10px;"><strong>Chairman</strong></span>
            </td>
            <td style="border:none; text-align:center; width:33%;">
                ______________________<br>
                <span style="font-size:10px;"><strong>Dean</strong></span>
            </td>
        </tr>
    </table>

    <div style="margin-top:15px; padding:8px; border:1px solid #ccc; background:#f9f9f9;">
        <p style="font-size:10px; margin:0;"><strong>Instructions:</strong> Attach photocopies of NID and all certificates/transcripts. Attach proof of job experience (if any). Submit to Dean's office by deadline. Collect admit card for Admission Test. Test date will be communicated via email/mobile.</p>
    </div>

</body>
</html>
