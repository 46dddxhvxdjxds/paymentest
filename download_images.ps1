$ids = @('1EOq92z56vnuYtadxrmf-Oq1rBc4PZfQe', '1Exzg5fN5iUbfiyrIRvAERsdooZcvtgxZ', '1RpCEYhksYWzxe4JtHPje7BhH4uXuPTnM', '1Pvc0Oiw_OrNa3hSaBA9Y5kk8ByCbunXc', '1AP5UaSUQgrUilaqOSWo-4tDQ_I6Xkt6q', '1rhZkt7LkYQQvAd7_pROa_2_Uoyzybwi1', '1qVsVwmz9DkFM4C6RliOqMfuNDR4WYwn-', '1gDIJgtlEJ5_r1kuLEWa_n_nDOhihq4zI')
$files = @('slider1.jpg', 'slider2.jpg', 'slider3.jpg', 'slider4.jpg', 'slider5.jpg', 'slider6.jpg', 'slider7.jpg', 'slider8.jpg')
for ($i=0; $i -lt $ids.Length; $i++) {
    Write-Host "Downloading $($files[$i])..."
    Invoke-WebRequest -Uri "https://drive.google.com/uc?export=download&id=$($ids[$i])" -OutFile "d:\Modern pipe traders\images\$($files[$i])"
}
