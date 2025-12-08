<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8" />
    <title>Admit Card - {{ $applicant->admission_roll }}</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 12px; margin:40px 60px; }
        .dotted-top { border-top:1px dotted #333; margin-top:5px; margin-bottom:10px; }
        .header { text-align:center; }
        .header .title { font-size:18px; font-weight:bold; }
        .header .subtitle { margin-top:6px; }
        .layout { width:100%; margin-top:10px; }
        .left-box { width:28%; vertical-align:top; }
        .center-box { width:44%; padding-left:10px; padding-right:10px; vertical-align:top; text-align:center; }
        .right-box { width:28%; vertical-align:top; text-align:right; }
        .office-table { border:1px solid #000; border-collapse:collapse; width:100%; }
        .office-table td { border:1px solid #000; padding:6px; }
        .photo-frame { width:120px; height:150px; border:1px solid #000; position:relative; overflow:hidden; }
        .info-line { margin-top:14px; }
        .fields { margin-top:18px; }
        .fields td { padding:6px 8px; vertical-align:top; }
        .field-label { display:block; margin-top:10px; text-align:right; vertical-align:top; padding-right:10px; }
        .name-value { display:block; margin-top:10px; text-align:left; vertical-align:top; padding-left:10px; }
        .signature-box { margin-top:50px; text-align:right; }
        .sig-line { display:block; margin-bottom:6px; }
        .small-note { font-size:10px; text-align:center; margin-top:6px; }
        .underline { border-bottom:1px solid #000; display:inline-block; min-width:200px; }
        .two-cols { width:100%; margin-top:8px; }
        .two-cols td { vertical-align:top; }
    </style>
</head>
<body>

    <div class="header">
        <table style="width:100%;">
            <tr>
                <td style="text-align:center;">
                    @if(file_exists(public_path('logo/university_logo.png')))
                        <img src="{{ public_path('logo/university_logo.png') }}" style="width:80px; height:80px; object-fit:contain;" />
                    @endif
                    <div style="font-size:20px; font-weight:bold; margin-top:5px;">UNIVERSITY OF BARISHAL</div>
                </td>
            </tr>
        </table>

        <div style="margin-top:10px; font-size:18px; font-weight:bold">ADMIT CARD</div>
    </div>

    <table class="layout" style="margin-left:auto; margin-right:auto;">
        <tr>
            <td class="left-box">
                <table class="office-table">
                    <tr><td colspan="2"><strong>For Office Use Only</strong></td></tr>
                    <tr><td style="width:40%">Form No.</td><td>{{ $applicant->form_no ?? '' }}</td></tr>
                    <tr><td>Admission Test Roll No.</td><td>{{ $applicant->admission_roll ?? '' }}</td></tr>
                </table>
            </td>

            <td class="center-box">
                Faculty of Business Studies<br>
                Application Form for Executive EMBA Admission<br>
                Session: {{ $session->session_name ?? '' }}
            </td>

            <td class="right-box">
                <div class="photo-frame">
                    @if($applicant->photo_path)
                        <img src="{{ public_path('storage/' . $applicant->photo_path) }}" style="position:absolute; top:0; left:0; width:100%; height:100%; object-fit:cover;" />
                    @else
                        <div style="font-size:10px; padding-top:60px; text-align:center;">Passport Size Photo</div>
                    @endif
                </div>
            </td>
        </tr>
    </table>

    <table class="two-cols" style="margin-left:auto; margin-right:auto;">
        <tr>
            <td style="width:10%"></td>
            <td style="width:90%">
                <div class="fields">
                    <table width="100%">
                        <tr>
                            <td style="width:18%; text-align:right; vertical-align:top;"><strong class="field-label">Full Name in Block Letters (in English):</strong></td>
                            <td style="width:82%; text-align:left; vertical-align:top;"><span class="underline name-value">{{ strtoupper($applicant->full_name ?? '') }}</span></td>
                        </tr>
                        <tr style="height:10px"></tr>
                        <tr>
                            <td style="width:18%; text-align:right; vertical-align:top;"><strong class="field-label">Father's Name:</strong></td>
                            <td style="width:82%; text-align:left; vertical-align:top; padding-top:5px;">
                                <span class="underline name-value">{{ $applicant->fathers_name ?? '' }}</span>
                            </td>
                        </tr>
                        <tr style="height:10px"></tr>
                        <tr>
                            <td style="width:18%; text-align:right; vertical-align:top;"><strong class="field-label">Mother's Name:</strong></td>
                            <td style="width:82%; text-align:left; vertical-align:top; padding-top:5px;">
                                <span class="underline name-value">{{ $applicant->mothers_name ?? '' }}</span>
                            </td>
                        </tr>
                    </table>
                </div>

                <div class="signature-box">
                    @if($applicant->signature_path)
                        <img src="{{ public_path('storage/' . $applicant->signature_path) }}" style="width:120px; height:35px; object-fit:contain;" /><br>
                    @endif
                    <div style="font-size:11px; border-top:1px dotted #000; display:inline-block; padding-top:4px; margin-top:40px;">Signature of the Applicant<br><span style="font-size:10px;">(Please See Overleaf)</span></div>
                </div>

            </td>
        </tr>
    </table>

</body>
</html>
