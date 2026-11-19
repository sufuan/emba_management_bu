<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>EMBA - Department of Management Studies, University of Barishal</title>

        <!-- Canonical URL -->
        <link rel="canonical" href="{{ url()->current() }}" />

        <!-- Primary SEO Meta Tags -->
        <meta name="description" content="Official EMBA admission portal for the Department of Management Studies, University of Barishal. Apply online for the Executive MBA program in Management Studies.">
        <meta name="keywords" content="EMBA, Executive MBA, Management Studies, University of Barishal, BU EMBA, EMBA admission, EMBA MGT, bu-embamgt">
        <meta name="robots" content="index, follow">
        <meta name="author" content="Department of Management Studies, University of Barishal">

        <!-- Open Graph / Facebook -->
        <meta property="og:type" content="website">
        <meta property="og:url" content="{{ url()->current() }}">
        <meta property="og:site_name" content="EMBA - Department of Management Studies, University of Barishal">
        <meta property="og:title" content="Executive MBA Program in Management Studies | University of Barishal">
        <meta property="og:description" content="Official EMBA admission portal for the Department of Management Studies, University of Barishal. Apply online for the Executive MBA program.">
        <meta property="og:image" content="{{ asset('logo/university_logo.png') }}">

        <!-- Twitter Card -->
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="Executive MBA Program in Management Studies | University of Barishal">
        <meta name="twitter:description" content="Official EMBA admission portal for the Department of Management Studies, University of Barishal.">
        <meta name="twitter:image" content="{{ asset('logo/university_logo.png') }}">

        <!-- JSON-LD Structured Data -->
        @php $logoUrl = asset('logo/university_logo.png'); @endphp
        <script type="application/ld+json">
        {
            "@@context": "https://schema.org",
            "@type": "EducationalOrganization",
            "name": "Department of Management Studies, University of Barishal",
            "alternateName": "BU EMBA MGT",
            "url": "https://www.bu-embamgt.com",
            "logo": "{{ $logoUrl }}",
            "description": "Official EMBA program admission portal for the Department of Management Studies, University of Barishal.",
            "address": {
                "@type": "PostalAddress",
                "addressLocality": "Barishal",
                "addressCountry": "BD"
            },
            "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Executive MBA Programs",
                "itemListElement": [
                    {
                        "@type": "Course",
                        "name": "Executive MBA in Management Studies",
                        "description": "A prestigious Executive MBA program designed for working professionals at the University of Barishal.",
                        "provider": {
                            "@type": "CollegeOrUniversity",
                            "name": "University of Barishal",
                            "url": "https://www.bu.ac.bd"
                        },
                        "url": "https://www.bu-embamgt.com"
                    }
                ]
            }
        }
        </script>

        <!-- Favicon -->
        <link rel="icon" type="image/png" href="{{ asset('logo/university_logo.png') }}">

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
