<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta name="author" content="">
	<meta name="viewport" content="width=device-width,initial-scale=1">
	<meta name="description" content="E-SPJ BKPSDM Buleleng">
	<title>E-SPJ - Login</title>
	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-BmbxuPwQa2lc/FVzBcNJ7UAyJxM6wuqIj61tLrc4wSX0szH/Ev+nYRRuWlolflfl" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
	<link rel="stylesheet" href="{{ asset('template/css/custom.css') }}">
</head>

<style>
	 body {
        background-color: #f4f6f9;
    }
</style>
<body>
	<section class="h-100">
		<div class="container h-100">
			<div class="row justify-content-sm-center h-100">
				<div class="col-xxl-4 col-xl-5 col-lg-5 col-md-7 col-sm-9">
					<div class="text-center mb-2 mt-5">
                        <img src="https://raw.githubusercontent.com/purnamayasa7/Images/main/KabBuleleng.png" alt="logo" width="100">
                        <h5 class="fw-bold mt-2 mb-4 text-muted">E-SPJ BKPSDM BULELENG</h5>
                    </div>

					<div class="card shadow-lg">
						<div class="card-body p-5">
							<h1 class="fs-4 card-title fw-bold mb-4 text-muted">Login</h1>
							<form id="formLogin" action="{{ route('login.post') }}" method="POST" class="needs-validation" novalidate="" autocomplete="off">
                                @csrf
								<div class="mb-3">
									<label class="mb-2 text-muted" for="inputNip">NIP</label>
                                    <div class="input-group">
                                        <span class="input-group-text bg-white text-muted"><i class="fa fa-user"></i></span>
                                        <input id="inputNip" type="text" class="form-control" name="nip" value="{{ old('nip') }}" placeholder="Masukkan NIP..." required autofocus>
                                    </div>
								</div>

								<div class="mb-3">
									<div class="mb-2 w-100">
										<label class="text-muted" for="password">Password</label>
										{{-- <a href="forgot.html" class="float-end">
											Forgot Password?
										</a> --}}
									</div>
                                    <div class="input-group">
                                        <span class="input-group-text bg-white text-muted"><i class="fas fa-key"></i></span>
                                        <input id="inputPassword" type="password" class="form-control form-control-user" name="password" placeholder="Password" required>
                                    </div>
								    <div class="invalid-feedback">
								    	Password is required
							    	</div>
								</div>

								<div class="d-flex align-items-center">
									<button type="submit" class="btn btn-primary ms-auto">
										Login
									</button>
								</div>
							</form>
						</div>
					</div>
					<div class="text-center mt-4 text-muted">
						<span>Copyright &copy; E-SPJ BKPSDM Buleleng 2025 - {{ date('Y') }}</span> 
					</div>
				</div>
			</div>
		</div>
	</section>
 <!-- SweetAlert2 -->
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>    
<script>
    document.addEventListener('DOMContentLoaded', () => {
        @if ($errors->any())
            Swal.fire({
                icon: 'error',
                title: 'Login Gagal!',
                text: '{{ $errors->first() }}',
            }).then(() => {
                document.querySelector('input[name="password"]').value = '';
            });
        @endif

        @if (session('success'))
        Swal.fire({
            icon: 'success',
            title: 'Berhasil!',
            text: '{{ session('success') }}',
            timer: 2000,
            showConfirmButton: false,
            timerProgressBar: true,
            didClose: () => {
                window.location.href = '/dashboard';
            }
        });
        @endif
    });
</script>
</body>
</html>