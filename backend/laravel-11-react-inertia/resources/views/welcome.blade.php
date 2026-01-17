<h1>🍸 Izdvojeni kokteli</h1>

<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px;">
@foreach($cocktails as $c)
    <div style="border:1px solid #ddd;border-radius:12px;overflow:hidden;">
        <img src="{{ $c->image_url }}" alt="{{ $c->name }}"
             style="width:100%;height:200px;object-fit:cover;display:block;">
        <div style="padding:12px;">
            <h3 style="margin:0 0 10px;">{{ $c->name }}</h3>

            <strong>Sastojci:</strong>
            <ul>
                @foreach($c->ingredients as $i)
                    <li>
                        {{ $i->name }}
                        @if($i->pivot?->quantity)
                            - {{ $i->pivot->quantity }} {{ $i->pivot->unit }}
                        @endif
                    </li>
                @endforeach
            </ul>
        </div>
    </div>
@endforeach
</div>
