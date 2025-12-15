@extends('layouts.app')

@section('content')
    <div class="container">
        <h1 class="h3 mb-0 text-gray-800">Kalender SPJ</h1>
        <div id="calendar"></div>
    </div>

    <style>
        .fc-event {
            cursor: pointer !important;
        }

        .fc-list-event {
            cursor: pointer !important;
        }
    </style>


    <!-- FullCalendar -->
    <link href="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.8/index.global.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.8/index.global.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.8/locales/id.global.min.js"></script>

    <div class="modal fade" id="spjModal" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
            <div class="modal-content">

                <div class="modal-header">
                    <h5 class="modal-title">Detail SPJ</h5>
                    <button type="button" class="close" data-dismiss="modal">
                        <span>&times;</span>
                    </button>
                </div>

                <div class="modal-body">

                    <div class="form-group">
                        <label>ID SPJ</label>
                        <input type="text" id="spjId" class="form-control" readonly>
                    </div>

                    <div class="form-group">
                        <label>Kegiatan</label>
                        <input type="text" id="spjkegiatan" class="form-control" readonly>
                    </div>

                    <div class="form-group">
                        <label>Tanggal SPJ</label>
                        <input type="text" id="spjtanggal_spj" class="form-control" readonly>
                    </div>

                    <div class="form-group">
                        <label>Bidang</label>
                        <input type="text" id="spjbidang" class="form-control" readonly>
                    </div>

                    <input type="hidden" id="spjId">
                </div>

                <div class="modal-footer">
                    <button class="btn btn-secondary" data-dismiss="modal">Tutup</button>
                    <a id="spjDetailBtn" class="btn btn-primary" href="#">Lihat Detail</a>
                </div>

            </div>
        </div>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            var calendarEl = document.getElementById('calendar');

            var calendar = new FullCalendar.Calendar(calendarEl, {
                initialView: 'dayGridMonth',
                locale: 'id',
                aspectRatio: 1.0,
                height: "auto",

                headerToolbar: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,listWeek'
                },

                events: "{{ route('calendar.events') }}",

                eventClick: function(info) {
                    $("#spjkegiatan").val(info.event.title);
                    $("#spjtanggal_spj").val(info.event.start.toLocaleDateString("id-ID"));
                    $("#spjbidang").val(info.event.extendedProps.bidang);
                    $("#spjId").val(info.event.id);

                    $("#spjDetailBtn").attr("href", "/spj/" + info.event.id);

                    $("#spjModal").modal("show");
                }
            });

            calendar.render();
        });
    </script>
@endsection
