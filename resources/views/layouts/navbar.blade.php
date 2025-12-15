{{-- <nav class="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow"> --}}
<nav class="navbar navbar-expand navbar-custom topbar mb-4 static-top">

    <!-- Sidebar Toggle (Topbar) -->
    <button id="sidebarToggleTop" class="btn btn-link d-md-none rounded-circle mr-3">
        <i class="fa fa-bars"></i>
    </button>

    <!-- Topbar Search -->
    <form id="searchForm" class="d-none d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search">
        <div class="input-group">
            <input type="text" id="searchQuery" class="form-control bg-light border-0 small"
                placeholder="Cari Data SPJ..." aria-label="Search" aria-describedby="basic-addon2">
            <div class="input-group-append">
                <button class="btn btn-primary" type="submit">
                    <i class="fas fa-search fa-sm"></i>
                </button>
            </div>
        </div>
    </form>


    <!-- Topbar Navbar -->
    <ul class="navbar-nav ml-auto">

        <!-- Nav Item - Search Dropdown (Visible Only XS) -->
        <li class="nav-item dropdown no-arrow d-sm-none">
            <a class="nav-link dropdown-toggle" href="#" id="searchDropdown" role="button" data-toggle="dropdown"
                aria-haspopup="true" aria-expanded="false">
                <i class="fas fa-search fa-fw"></i>
            </a>
            <!-- Dropdown - Messages -->
            <div class="dropdown-menu dropdown-menu-right p-3 shadow animated--grow-in"
                aria-labelledby="searchDropdown">
                <form class="form-inline mr-auto w-100 navbar-search">
                    <div class="input-group">
                        <input type="text" class="form-control bg-light border-0 small" placeholder="Search for..."
                            aria-label="Search" aria-describedby="basic-addon2">
                        <div class="input-group-append">
                            <button class="btn btn-primary" type="button">
                                <i class="fas fa-search fa-sm"></i>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </li>

        <!-- Nav Item - Notifications -->
        <li class="nav-item dropdown no-arrow mx-1">
            @php
                use Illuminate\Support\Facades\Auth;
                use Illuminate\Support\Facades\Storage;

                $user = Auth::user();
                $notifications = $user ? $user->notifications()->latest()->take(5)->get() : collect();
                $unreadCount = $user ? $user->unreadNotifications->count() : 0;
            @endphp

            <a class="nav-link dropdown-toggle" href="#" id="alertsDropdown" role="button" data-toggle="dropdown"
                aria-haspopup="true" aria-expanded="false">
                <i class="fas fa-bell fa-fw"></i>
                @if ($unreadCount > 0)
                    <span class="badge badge-danger badge-counter">
                        {{ $unreadCount > 99 ? '99+' : $unreadCount }}
                    </span>
                @endif
            </a>

            <div class="dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in"
                aria-labelledby="alertsDropdown">
                <h6 class="dropdown-header">Notifikasi</h6>

                @forelse ($notifications as $notif)
                    @php
                        $status = $notif->data['status'] ?? 'unknown';
                        $icon = 'fa-info-circle';
                        $bgColor = 'bg-secondary';

                        switch ($status) {
                            case 'Dikirim':
                                $icon = 'fa-paper-plane';
                                $bgColor = 'bg-success';
                                break;
                            case 'Dikoreksi':
                                $icon = 'fa-exclamation-triangle';
                                $bgColor = 'bg-warning';
                                break;
                            case 'Disetujui':
                                $icon = 'fa-check-circle';
                                $bgColor = 'bg-primary';
                                break;
                        }
                    @endphp

                    <a class="dropdown-item d-flex align-items-center"
                        href="{{ route('notifications.open', $notif->id) }}">
                        <div class="mr-3">
                            <div
                                class="icon-circle @if (str_contains($notif->data['message'] ?? '', 'Disetujui')) bg-primary
    @elseif(str_contains($notif->data['message'] ?? '', 'Dikoreksi')) bg-warning
    @else bg-success @endif">
                                <i class="fas {{ $icon }} text-white"></i>
                            </div>
                        </div>
                        <div>
                            <div class="small text-gray-500">{{ $notif->created_at->diffForHumans() }}</div>
                            <span class="{{ $notif->read_at ? '' : 'font-weight-bold' }}">
                                {{ $notif->data['message'] ?? 'Tidak ada pesan.' }}
                            </span>
                        </div>
                    </a>
                @empty
                    <div class="dropdown-item text-center small text-gray-500">
                        Tidak ada notifikasi baru.
                    </div>
                @endforelse

                <a class="dropdown-item text-center small text-gray-500" href="{{ route('notifications.index') }}">
                    Lihat Semua
                </a>
            </div>
        </li>


        <!-- Nav Item - Messages -->
        <li class="nav-item dropdown no-arrow mx-1">
            <a class="nav-link dropdown-toggle" href="#" id="messagesDropdown" role="button"
                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <i class="fas fa-envelope fa-fw"></i>
                <!-- Counter - Messages -->
                <span class="badge badge-danger badge-counter"></span>
            </a>
            <!-- Dropdown - Messages -->
            <div class="dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in"
                aria-labelledby="messagesDropdown">
                <h6 class="dropdown-header">
                    Message Center
                </h6>
                <a class="dropdown-item text-center small text-gray-500" href="#">Read More Messages</a>
            </div>
        </li>

        <div class="topbar-divider d-none d-sm-block"></div>

        @auth
            <!-- Nav Item - User Information -->
            <li class="nav-item dropdown no-arrow">
                <a class="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-toggle="dropdown"
                    aria-haspopup="true" aria-expanded="false">
                    <span class="mr-2 d-none d-lg-inline text-gray-600 small">{{ auth()->user()->name }}</span>
                    <img class="img-profile rounded-circle" src="{{ asset('template/img/undraw_profile.svg') }}">
                </a>
                <!-- Dropdown - User Information -->
                <div class="dropdown-menu dropdown-menu-right shadow animated--grow-in" aria-labelledby="userDropdown">
                    <a class="dropdown-item" id="userDropdown" href="/profile">
                        <i class="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
                        Profil
                    </a>
                    <a class="dropdown-item" href="/change-password">
                        <i class="fas fa-cogs fa-sm fa-fw mr-2 text-gray-400"></i>
                        Ubah Password
                    </a>
                    <div class="dropdown-divider"></div>
                    <a class="dropdown-item" href="#" data-toggle="modal" data-target="#logoutModal">
                        <i class="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                        Logout
                    </a>
                </div>
            </li>
        @endauth
    </ul>
</nav>

<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script>
    $(document).ready(function () {

    $('#searchForm').submit(function (e) {
        e.preventDefault();
        let q = $('#searchQuery').val();

        if (q.trim() === "") return;

        // Redirect ke halaman hasil pencarian
        window.location.href = "/spj/search-results?query=" + encodeURIComponent(q);
    });

});
</script>
