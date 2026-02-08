 @php
     $menus = [
         // Role_id = 1 → KEUANGAN
         1 => [
             // Divider
             (object) [
                 'type' => 'divider',
             ],

             // Heading
             (object) [
                 'type' => 'heading',
                 'title' => 'SPJ',
             ],

             (object) [
                 'type' => 'item',
                 'title' => 'Dashboard',
                 'path' => 'dashboard',
                 'icon' => 'fas fa-fw fa-chart-bar',
                 'active_key' => 'dashboard-keuangan',
             ],
             (object) [
                 'type' => 'item',
                 'title' => 'Review SPJ',
                 'path' => 'keuangan/spj',
                 'icon' => 'fas fa-fw fa-table',
                 'active_key' => 'review-spj',
             ],
             (object) [
                 'type' => 'item',
                 'title' => 'History SPJ',
                 'path' => route('spj.history.index'),
                 'icon' => 'fas fa-fw fa-history',
                 'active_key' => 'history',
             ],
             (object) [
                 'type' => 'item',
                 'title' => 'Kalender',
                 'path' => 'calendar/spj',
                 'icon' => 'fas fa-fw fa-calendar',
                 'active_key' => 'calendar',
             ],
             (object) [
                 'type' => 'collapse',
                 'title' => 'Laporan',
                 'icon' => 'fas fa-fw fa-file-alt',
                 'target' => 'collapseLaporan',
                 'active_key' => 'laporan-menu',
                 'children' => [
                     (object) [
                         'title' => 'SPJ Disetujui',
                         'path' => 'keuangan/spj/disetujui',
                         'active_key' => 'laporan-spj',
                     ],
                     (object) [
                         'title' => 'Aktivitas User',
                         'path' => 'activity',
                         'active_key' => 'aktivitas-user',
                     ],
                 ],
             ],

             // Divider
             (object) [
                 'type' => 'divider',
             ],

             // Heading
             (object) [
                 'type' => 'heading',
                 'title' => 'Admin',
             ],

             (object) [
                 'type' => 'item',
                 'title' => 'Users',
                 'path' => 'user',
                 'icon' => 'fas fa-fw fa-users',
                 'active_key' => 'users',
             ],
             (object) [
                 'type' => 'item',
                 'title' => 'Pegawai',
                 'path' => route('keuangan.pegawai.index'),
                 'icon' => 'fas fa-fw fa-user-tie',
                 'active_key' => 'pegawai',
             ],
             (object) [
                 'type' => 'item',
                 'title' => 'Backup Database',
                 'path' => route('backup.run'),
                 'icon' => 'fas fa-fw fa-database',
                 'active_key' => 'backup',
             ],
         ],

         // Role_id = 2 → BIDANG
         2 => [
             // Divider
             (object) [
                 'type' => 'divider',
             ],

             // Heading
             (object) [
                 'type' => 'heading',
                 'title' => 'SPJ',
             ],
             (object) [
                 'type' => 'item',
                 'title' => 'Dashboard',
                 'path' => 'dashboard',
                 'icon' => 'fas fa-fw fa-chart-bar',
                 'active_key' => 'dashboard-bidang',
             ],
             (object) [
                 'type' => 'item',
                 'title' => 'Data SPJ',
                 'path' => 'spj',
                 'icon' => 'fas fa-fw fa-table',
                 'active_key' => 'data-spj',
             ],

             (object) [
                 'type' => 'item',
                 'title' => 'Riwayat SPJ',
                 'path' => route('spj.history.index'),
                 'icon' => 'fas fa-fw fa-history',
                 'active_key' => 'history',
             ],
         ],
     ];
 @endphp

 <ul class="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">

     <!-- Sidebar - Brand -->
     <a class="sidebar-brand d-flex align-items-center justify-content-center" href="{{ url('/dashboard') }}">
         <div class="sidebar-brand-icon">
             <img src="https://raw.githubusercontent.com/purnamayasa7/Images/main/KabBuleleng.png" alt="Logo BKPSDM"
                 width="50" height="50" style="margin-right: 5px">
         </div>
         <div class="sidebar-brand-text">E-SPJ BKPSDM</div>
     </a>

     <!-- Menu Items -->
     @foreach ($menus[auth()->user()->role_id] as $menu)
         @if ($menu->type === 'item')
             @php
                 $isActive = request()->is($menu->path) || request()->get('menu') === $menu->active_key;
             @endphp

             <li class="nav-item {{ $isActive ? 'active' : '' }}">
                 <a class="nav-link" href="{{ url($menu->path) }}?menu={{ $menu->active_key }}">
                     <i class="{{ $menu->icon }}"></i>
                     <span>{{ $menu->title }}</span>
                 </a>
             </li>
         @elseif ($menu->type === 'divider')
             <hr class="sidebar-divider">
         @elseif ($menu->type === 'heading')
             <div class="sidebar-heading">{{ $menu->title }}</div>
         @elseif ($menu->type === 'collapse')
             @php
                 // CEK APAKAH COLLAPSE AKTIF
                 $isParentActive =
                     request()->get('menu') === $menu->active_key ||
                     collect($menu->children)->contains(function ($child) {
                         return request()->is($child->path) || request()->get('menu') === $child->active_key;
                     });
             @endphp

             <li class="nav-item {{ $isParentActive ? 'active' : '' }}">
                 <a class="nav-link d-flex justify-content-between align-items-center {{ $isParentActive ? '' : 'collapsed' }}"
                     href="#" data-toggle="collapse" data-target="#{{ $menu->target }}"
                     aria-expanded="{{ $isParentActive ? 'true' : 'false' }}" aria-controls="{{ $menu->target }}">

                     <div>
                         <i class="{{ $menu->icon }}"></i>
                         <span>{{ $menu->title }}</span>
                     </div>

                 </a>

                 <div id="{{ $menu->target }}" class="collapse {{ $isParentActive ? 'show' : '' }}"
                     data-parent="#accordionSidebar">

                     <div class="bg-white py-2 collapse-inner rounded">
                         <h6 class="collapse-header">{{ $menu->title }}:</h6>

                         @foreach ($menu->children as $child)
                             <a class="collapse-item {{ request()->is($child->path) ? 'active' : '' }}"
                                 href="{{ url($child->path) }}?menu={{ $child->active_key }}">
                                 {{ $child->title }}
                             </a>
                         @endforeach
                     </div>
                 </div>
             </li>
         @endif
     @endforeach

     <!-- Divider -->
     <hr class="sidebar-divider d-none d-md-block">

     <!-- Sidebar Toggler -->
     <div class="text-center d-none d-md-inline">
         <button class="rounded-circle border-0" id="sidebarToggle"></button>
     </div>

 </ul>
