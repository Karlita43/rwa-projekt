<?php

return [

    'accepted' => 'Polje :attribute mora biti prihvaćeno.',
    'accepted_if' => 'Polje :attribute mora biti prihvaćeno kada je :other :value.',
    'active_url' => 'Polje :attribute mora biti ispravan URL.',
    'after' => 'Polje :attribute mora biti datum nakon :date.',
    'after_or_equal' => 'Polje :attribute mora biti datum nakon ili jednak :date.',
    'alpha' => 'Polje :attribute smije sadržavati samo slova.',
    'alpha_dash' => 'Polje :attribute smije sadržavati samo slova, brojeve, crtice i donje crtice.',
    'alpha_num' => 'Polje :attribute smije sadržavati samo slova i brojeve.',
    'any_of' => 'Polje :attribute nije ispravno.',
    'array' => 'Polje :attribute mora biti niz.',
    'ascii' => 'Polje :attribute smije sadržavati samo ASCII znakove.',
    'before' => 'Polje :attribute mora biti datum prije :date.',
    'before_or_equal' => 'Polje :attribute mora biti datum prije ili jednak :date.',

    'between' => [
        'array' => 'Polje :attribute mora imati između :min i :max stavki.',
        'file' => 'Polje :attribute mora biti između :min i :max kilobajta.',
        'numeric' => 'Polje :attribute mora biti između :min i :max.',
        'string' => 'Polje :attribute mora imati između :min i :max znakova.',
    ],

    'boolean' => 'Polje :attribute mora biti istina ili laž.',
    'can' => 'Polje :attribute sadrži neautoriziranu vrijednost.',
    'confirmed' => 'Potvrda polja :attribute se ne podudara.',
    'contains' => 'Polje :attribute ne sadrži traženu vrijednost.',
    'current_password' => 'Lozinka nije točna.',
    'date' => 'Polje :attribute mora biti ispravan datum.',
    'date_equals' => 'Polje :attribute mora biti datum jednak :date.',
    'date_format' => 'Polje :attribute mora odgovarati formatu :format.',
    'decimal' => 'Polje :attribute mora imati :decimal decimalnih mjesta.',
    'declined' => 'Polje :attribute mora biti odbijeno.',
    'declined_if' => 'Polje :attribute mora biti odbijeno kada je :other :value.',
    'different' => 'Polja :attribute i :other moraju biti različita.',
    'digits' => 'Polje :attribute mora imati :digits znamenki.',
    'digits_between' => 'Polje :attribute mora imati između :min i :max znamenki.',
    'dimensions' => 'Polje :attribute ima neispravne dimenzije slike.',
    'distinct' => 'Polje :attribute sadrži dupliciranu vrijednost.',
    'doesnt_contain' => 'Polje :attribute ne smije sadržavati: :values.',
    'doesnt_end_with' => 'Polje :attribute ne smije završavati s: :values.',
    'doesnt_start_with' => 'Polje :attribute ne smije započinjati s: :values.',
    'email' => 'Polje :attribute mora biti ispravna email adresa.',
    'encoding' => 'Polje :attribute mora biti kodirano u :encoding.',
    'ends_with' => 'Polje :attribute mora završavati s: :values.',
    'enum' => 'Odabrana vrijednost za :attribute nije ispravna.',
    'exists' => 'Odabrana vrijednost za :attribute nije ispravna.',
    'extensions' => 'Polje :attribute mora imati jednu od sljedećih ekstenzija: :values.',
    'file' => 'Polje :attribute mora biti datoteka.',
    'filled' => 'Polje :attribute mora imati vrijednost.',

    'gt' => [
        'array' => 'Polje :attribute mora imati više od :value stavki.',
        'file' => 'Polje :attribute mora biti veće od :value kilobajta.',
        'numeric' => 'Polje :attribute mora biti veće od :value.',
        'string' => 'Polje :attribute mora imati više od :value znakova.',
    ],

    'gte' => [
        'array' => 'Polje :attribute mora imati :value ili više stavki.',
        'file' => 'Polje :attribute mora biti veće ili jednako :value kilobajta.',
        'numeric' => 'Polje :attribute mora biti veće ili jednako :value.',
        'string' => 'Polje :attribute mora imati :value ili više znakova.',
    ],

    'hex_color' => 'Polje :attribute mora biti ispravna heksadecimalna boja.',
    'image' => 'Polje :attribute mora biti slika.',
    'in' => 'Odabrana vrijednost za :attribute nije ispravna.',
    'in_array' => 'Polje :attribute mora postojati u :other.',
    'in_array_keys' => 'Polje :attribute mora sadržavati barem jedan od ključeva: :values.',
    'integer' => 'Polje :attribute mora biti cijeli broj.',
    'ip' => 'Polje :attribute mora biti ispravna IP adresa.',
    'ipv4' => 'Polje :attribute mora biti ispravna IPv4 adresa.',
    'ipv6' => 'Polje :attribute mora biti ispravna IPv6 adresa.',
    'json' => 'Polje :attribute mora biti ispravan JSON string.',
    'list' => 'Polje :attribute mora biti lista.',
    'lowercase' => 'Polje :attribute mora biti malim slovima.',

    'lt' => [
        'array' => 'Polje :attribute mora imati manje od :value stavki.',
        'file' => 'Polje :attribute mora biti manje od :value kilobajta.',
        'numeric' => 'Polje :attribute mora biti manje od :value.',
        'string' => 'Polje :attribute mora imati manje od :value znakova.',
    ],

    'lte' => [
        'array' => 'Polje :attribute ne smije imati više od :value stavki.',
        'file' => 'Polje :attribute mora biti manje ili jednako :value kilobajta.',
        'numeric' => 'Polje :attribute mora biti manje ili jednako :value.',
        'string' => 'Polje :attribute mora imati najviše :value znakova.',
    ],

    'mac_address' => 'Polje :attribute mora biti ispravna MAC adresa.',

    'max' => [
        'array' => 'Polje :attribute ne smije imati više od :max stavki.',
        'file' => 'Polje :attribute ne smije biti veće od :max kilobajta.',
        'numeric' => 'Polje :attribute ne smije biti veće od :max.',
        'string' => 'Polje :attribute ne smije imati više od :max znakova.',
    ],

    'max_digits' => 'Polje :attribute ne smije imati više od :max znamenki.',
    'mimes' => 'Polje :attribute mora biti datoteka tipa: :values.',
    'mimetypes' => 'Polje :attribute mora biti datoteka tipa: :values.',

    'min' => [
        'array' => 'Polje :attribute mora imati barem :min stavki.',
        'file' => 'Polje :attribute mora biti barem :min kilobajta.',
        'numeric' => 'Polje :attribute mora biti barem :min.',
        'string' => 'Polje :attribute mora imati barem :min znakova.',
    ],

    'min_digits' => 'Polje :attribute mora imati barem :min znamenki.',
    'missing' => 'Polje :attribute mora izostati.',
    'missing_if' => 'Polje :attribute mora izostati kada je :other :value.',
    'missing_unless' => 'Polje :attribute mora izostati osim ako je :other :value.',
    'missing_with' => 'Polje :attribute mora izostati kada su prisutni: :values.',
    'missing_with_all' => 'Polje :attribute mora izostati kada su prisutni svi: :values.',
    'multiple_of' => 'Polje :attribute mora biti višekratnik broja :value.',
    'not_in' => 'Odabrana vrijednost za :attribute nije ispravna.',
    'not_regex' => 'Format polja :attribute nije ispravan.',
    'numeric' => 'Polje :attribute mora biti broj.',

    'password' => [
        'letters' => 'Polje :attribute mora sadržavati barem jedno slovo.',
        'mixed' => 'Polje :attribute mora sadržavati barem jedno veliko i jedno malo slovo.',
        'numbers' => 'Polje :attribute mora sadržavati barem jedan broj.',
        'symbols' => 'Polje :attribute mora sadržavati barem jedan simbol.',
        'uncompromised' => 'Odabrana :attribute se pojavila u curenju podataka. Odaberite drugu.',
    ],

    'present' => 'Polje :attribute mora biti prisutno.',
    'present_if' => 'Polje :attribute mora biti prisutno kada je :other :value.',
    'present_unless' => 'Polje :attribute mora biti prisutno osim ako je :other :value.',
    'present_with' => 'Polje :attribute mora biti prisutno kada su prisutni: :values.',
    'present_with_all' => 'Polje :attribute mora biti prisutno kada su prisutni svi: :values.',
    'prohibited' => 'Polje :attribute je zabranjeno.',
    'prohibited_if' => 'Polje :attribute je zabranjeno kada je :other :value.',
    'prohibited_if_accepted' => 'Polje :attribute je zabranjeno kada je :other prihvaćeno.',
    'prohibited_if_declined' => 'Polje :attribute je zabranjeno kada je :other odbijeno.',
    'prohibited_unless' => 'Polje :attribute je zabranjeno osim ako je :other u :values.',
    'prohibits' => 'Polje :attribute zabranjuje prisutnost :other.',
    'regex' => 'Format polja :attribute nije ispravan.',
    'required' => 'Polje :attribute je obavezno.',
    'required_array_keys' => 'Polje :attribute mora sadržavati ključeve: :values.',
    'required_if' => 'Polje :attribute je obavezno kada je :other :value.',
    'required_if_accepted' => 'Polje :attribute je obavezno kada je :other prihvaćeno.',
    'required_if_declined' => 'Polje :attribute je obavezno kada je :other odbijeno.',
    'required_unless' => 'Polje :attribute je obavezno osim ako je :other u :values.',
    'required_with' => 'Polje :attribute je obavezno kada su prisutni: :values.',
    'required_with_all' => 'Polje :attribute je obavezno kada su prisutni svi: :values.',
    'required_without' => 'Polje :attribute je obavezno kada :values nisu prisutni.',
    'required_without_all' => 'Polje :attribute je obavezno kada nijedna od :values nije prisutna.',
    'same' => 'Polje :attribute mora odgovarati polju :other.',

    'size' => [
        'array' => 'Polje :attribute mora sadržavati :size stavki.',
        'file' => 'Polje :attribute mora biti :size kilobajta.',
        'numeric' => 'Polje :attribute mora biti :size.',
        'string' => 'Polje :attribute mora imati :size znakova.',
    ],

    'starts_with' => 'Polje :attribute mora započinjati s: :values.',
    'string' => 'Polje :attribute mora biti tekst.',
    'timezone' => 'Polje :attribute mora biti ispravna vremenska zona.',
    'unique' => 'Vrijednost polja :attribute je već zauzeta.',
    'uploaded' => 'Učitavanje polja :attribute nije uspjelo.',
    'uppercase' => 'Polje :attribute mora biti velikim slovima.',
    'url' => 'Polje :attribute mora biti ispravan URL.',
    'ulid' => 'Polje :attribute mora biti ispravan ULID.',
    'uuid' => 'Polje :attribute mora biti ispravan UUID.',

    'custom' => [
        'attribute-name' => [
            'rule-name' => 'prilagođena poruka',
        ],
    ],

    'attributes' => [
        // npr.
        // 'email' => 'email adresa',
        // 'password' => 'lozinka',
    ],

];
