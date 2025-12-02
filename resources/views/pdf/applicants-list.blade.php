<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Applicants List</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'DejaVu Sans', sans-serif; font-size: 10px; }
        .header { text-align: center; margin-bottom: 20px; }
        .header h1 { font-size: 16px; color: #1e40af; }
        .header p { color: #666; }
        table { width: 100%; border-collapse: collapse; }
        th { background: #1e40af; color: white; padding: 8px; text-align: left; font-size: 9px; }
        td { padding: 6px 8px; border-bottom: 1px solid #eee; }
        tr:nth-child(even) { background: #f9fafb; }
        .status { padding: 2px 6px; border-radius: 3px; font-size: 8px; }
        .status-submitted { background: #dbeafe; color: #1e40af; }
        .status-pending { background: #fef3c7; color: #d97706; }
        .status-verified { background: #d1fae5; color: #059669; }
        .footer { margin-top: 20px; text-align: center; font-size: 9px; color: #666; }
    </style>
</head>
<body>
    <div class="header">
        <h1>EMBA Applicants List</h1>
        <p>Generated on {{ now()->format('d M, Y h:i A') }} | Total: {{ $applicants->count() }} applicants</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>#</th>
                <th>Form No</th>
                <th>Roll</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Subject</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            @foreach($applicants as $index => $applicant)
            <tr>
                <td>{{ $index + 1 }}</td>
                <td>{{ $applicant->form_no }}</td>
                <td>{{ $applicant->admission_roll }}</td>
                <td>{{ $applicant->full_name }}</td>
                <td>{{ $applicant->phone }}</td>
                <td>{{ $applicant->email }}</td>
                <td>{{ $applicant->subject_choice }}</td>
                <td><span class="status status-{{ $applicant->status }}">{{ ucfirst($applicant->status) }}</span></td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        <p>EMBA Admission System</p>
    </div>
</body>
</html>
