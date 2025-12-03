<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8" />
    <title>Application Form - {{ $applicant->form_no }}</title>
    <style>
        body { font-family: sans-serif; font-size: 12px; }
        .section-title { font-size: 16px; font-weight: bold; margin-bottom: 10px; text-align:center; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
        table td, table th { border: 1px solid #000; padding: 6px; }
        .flex { display: flex; justify-content: space-between; }
        .signature-right { text-align: right; font-weight: bold; margin-top: 40px; }
        .office-box { border: 2px solid #000; padding: 15px; margin-top: 20px; }
        .office-signatures { display: flex; justify-content: space-between; gap: 15px; }
    </style>
</head>
<body style="margin:60px;">

    <div style="text-align:center; margin-bottom:20px;">
        @if(file_exists(public_path('logo/university_logo.png')))
            <img src="{{ public_path('logo/university_logo.png') }}" alt="University Logo" style="width:80px; height:auto;">
        @endif
        <div style="font-size:20px; font-weight:bold;">UNIVERSITY OF BARISHAL</div>
        <div>Faculty of Business Studies</div>
        <div style="font-weight:bold;">Application Form for Executive MBA Admission</div>
        <div>Session: {{ $session->session_name }}</div>
        <div style="font-size:12px;">Please read the application guidelines provided at the end<br>before you complete the application form</div>
    </div>

    <div style="position:absolute; top:140px; right:40px; width:120px; height:150px; border:1px solid #000; text-align:center;">
        @if($applicant->photo_path)
            <img src="{{ public_path('storage/' . $applicant->photo_path) }}" style="width:100%; height:100%; object-fit:cover;" />
        @else
            <div style="font-size:10px; padding-top:40px;">Passport Size Photo</div>
        @endif
    </div>
    <div class="section-title">ADMISSION APPLICATION FORM</div>
    <div style="text-align:center; margin-bottom:15px;"><strong>Form No: {{ $applicant->form_no }}</strong> | <strong>Admission Roll: {{ $applicant->admission_roll }}</strong></div>

    <p><strong>1. Full Name in Block Letters (in English):</strong> {{ strtoupper($applicant->full_name) }}</p>

    <p><strong>2. Father's Name:</strong> {{ $applicant->fathers_name }}</p>

    <p><strong>3. Mother's Name:</strong> {{ $applicant->mothers_name }}</p>

    <p><strong>4. Contact Details:</strong></p>
    <p>(a) Mobile No.: {{ $applicant->phone }}</p>
    <p>(b) Email: {{ $applicant->email }}</p>

    <p><strong>5. Date of Birth (DD/MM/YYYY):</strong> {{ $applicant->dob?->format('d/m/Y') }}</p>

    <p><strong>6. NID Number:</strong> {{ $applicant->nid }}</p>

    <p><strong>7. Educational Qualifications of the Applicant</strong></p>
    <table>
        <thead>
            <tr>
                <th>Examination</th>
                <th>Year of Passing</th>
                <th>Board / University</th>
                <th>Subject / Dept.</th>
                <th>Division / CGPA</th>
            </tr>
        </thead>
        <tbody>
            @php
                $eduData = $applicant->education_json;
                $rows = [
                    ['key' => 'ssc', 'label' => 'SSC / Equivalent'],
                    ['key' => 'hsc', 'label' => 'HSC / Equivalent'],
                    ['key' => 'bachelor', 'label' => '4 Years Bachelor'],
                    ['key' => 'master', 'label' => 'Master (if any)'],
                ];
            @endphp
            @foreach($rows as $row)
                @php
                    $edu = $eduData[$row['key']] ?? [];
                    $board = $edu['board'] ?? $edu['university'] ?? '';
                    $subject = $edu['subject'] ?? $edu['department'] ?? '';
                    $year = $edu['year'] ?? '';
                    $result = $edu['result'] ?? '';
                    // Skip master row if empty
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

    <p><strong>8. Job Experience (if any)</strong></p>
    @php
        $hasExperience = false;
        if($applicant->experience_json && is_array($applicant->experience_json)) {
            foreach($applicant->experience_json as $exp) {
                if(!empty($exp['position']) || !empty($exp['company']) || !empty($exp['duration'])) {
                    $hasExperience = true;
                    break;
                }
            }
        }
    @endphp
    @if($hasExperience)
        <table>
            <thead>
                <tr>
                    <th>Position</th>
                    <th>Company/Organization</th>
                    <th>Duration</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($applicant->experience_json as $exp)
                    @if(!empty($exp['position']) || !empty($exp['company']) || !empty($exp['duration']))
                    <tr>
                        <td>{{ $exp['position'] ?? '' }}</td>
                        <td>{{ $exp['company'] ?? '' }}</td>
                        <td>{{ $exp['duration'] ?? '' }}</td>
                    </tr>
                    @endif
                @endforeach
            </tbody>
        </table>
    @else
        <p style="margin-left:20px;">N/A</p>
    @endif

    <p><strong>9. Subject Choice:</strong> {{ $applicant->subject_choice }}</p>

    <p><strong>Applicant's Declaration</strong></p>
    <p>The information provided in this application form is true and correct. I accept that the University of Barishal reserves the right to terminate my admission at any time if any item of the information I gave is found to be false or incorrect.</p>
    <p>I declare that if I get admission to the University of Barishal:</p>
    <ul>
        <li>I will abide by all the rules and regulations of the University.</li>
        <li>During my studentship here, I will comply with any decision of any authority of the University or decisions of any person authorized by the University.</li>
        <li>I will comply with any changes in the rules and ordinances of the University.</li>
    </ul>

    <div class="signature-right" style="text-align:right; margin-top:50px;">
        @if($applicant->signature_path)
            <img src="{{ public_path('storage/' . $applicant->signature_path) }}" style="width:150px; height:40px; object-fit:contain;" /><br>
        @else
            ____________________<br>
        @endif
        <strong>Signature of the Applicant</strong><br>
        <small>Date: {{ $applicant->submitted_at?->format('d/m/Y') }}</small>
    </div>

    <h3>For Office Use Only</h3>
    <div class="office-box">
        <table style="border:none;">
            <tr>
                <td style="border:none; text-align:center; width:33%;">
                    ______________________<br>
                    <strong>Signature of the Scrutinizer</strong>
                </td>
                <td style="border:none; text-align:center; width:33%;">
                    ______________________<br>
                    <strong>Signature of the Chairman</strong>
                </td>
                <td style="border:none; text-align:center; width:33%;">
                    ______________________<br>
                    <strong>Signature of the Dean</strong>
                </td>
            </tr>
        </table>
    </div>

    <h3>Instructions for Completing the Application Form</h3>
    <ul>
        <li>Please affix two recent passport-size photographs on the specified boxes.</li>
        <li>Please attach photocopies of the NID card and all certificates, mark sheets, and/or transcripts.</li>
        <li>Please attach proof of all job experiences (if any).</li>
        <li>Your application must be submitted to the Dean's office by the deadline.</li>
        <li>Make sure all sections of the form are completed, including the admit card.</li>
        <li>Collect the admit card, without which you cannot sit for the Admission Test.</li>
        <li>The admission test date will be communicated via email and mobile.</li>
    </ul>

</body>
</html>
