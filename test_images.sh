#!/bin/bash

# Array of all image URLs from gameData.ts
urls=(
  "https://images.pexels.com/photos/1149831/pexels-photo-1149831.jpeg?auto=compress&cs=tinysrgb&w=800"
  "https://images.pexels.com/photos/3729464/pexels-photo-3729464.jpeg?auto=compress&cs=tinysrgb&w=800"
  "https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg?auto=compress&cs=tinysrgb&w=800"
  "https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=800"
  "https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=800"
  "https://images.pexels.com/photos/892522/pexels-photo-892522.jpeg?auto=compress&cs=tinysrgb&w=800"
  "https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=800"
  "https://images.pexels.com/photos/2127733/pexels-photo-2127733.jpeg?auto=compress&cs=tinysrgb&w=800"
  "https://images.pexels.com/photos/1719648/pexels-photo-1719648.jpeg?auto=compress&cs=tinysrgb&w=800"
  "https://images.pexels.com/photos/3311574/pexels-photo-3311574.jpeg?auto=compress&cs=tinysrgb&w=800"
  "https://images.pexels.com/photos/3764984/pexels-photo-3764984.jpeg?auto=compress&cs=tinysrgb&w=800"
  "https://images.pexels.com/photos/2365572/pexels-photo-2365572.jpeg?auto=compress&cs=tinysrgb&w=800"
  "https://images.pexels.com/photos/1429775/pexels-photo-1429775.jpeg?auto=compress&cs=tinysrgb&w=800"
  "https://images.pexels.com/photos/3593922/pexels-photo-3593922.jpeg?auto=compress&cs=tinysrgb&w=800"
  "https://images.pexels.com/photos/2676096/pexels-photo-2676096.jpeg?auto=compress&cs=tinysrgb&w=800"
  "https://images.pexels.com/photos/3972755/pexels-photo-3972755.jpeg?auto=compress&cs=tinysrgb&w=800"
  "https://images.pexels.com/photos/1164778/pexels-photo-1164778.jpeg?auto=compress&cs=tinysrgb&w=800"
  "https://images.pexels.com/photos/6894429/pexels-photo-6894429.jpeg?auto=compress&cs=tinysrgb&w=800"
  "https://images.pexels.com/photos/3156482/pexels-photo-3156482.jpeg?auto=compress&cs=tinysrgb&w=800"
  "https://images.pexels.com/photos/3954426/pexels-photo-3954426.jpeg?auto=compress&cs=tinysrgb&w=800"
)

brands=(
  "Peugeot"
  "Renault"
  "Mercedes-Benz"
  "Ferrari"
  "Nissan"
  "BMW"
  "Jeep"
  "Lamborghini"
  "Audi"
  "Ford"
  "Rolls-Royce"
  "Toyota"
  "Volkswagen"
  "Honda"
  "Porsche"
  "Chevrolet"
  "Range Rover"
  "McLaren"
  "Mini"
  "Tesla"
)

echo "Testing all 20 image URLs..."
echo "================================"

failed=0
success=0

for i in {0..19}; do
  url="${urls[$i]}"
  brand="${brands[$i]}"
  
  # Test the URL with curl
  http_code=$(curl -s -o /dev/null -w "%{http_code}" "$url")
  
  if [ "$http_code" = "200" ]; then
    echo "✅ Image $((i+1)) ($brand): SUCCESS (HTTP $http_code)"
    ((success++))
  else
    echo "❌ Image $((i+1)) ($brand): FAILED (HTTP $http_code)"
    echo "   URL: $url"
    ((failed++))
  fi
done

echo "================================"
echo "SUMMARY:"
echo "✅ Success: $success/20"
echo "❌ Failed: $failed/20"

if [ $failed -eq 0 ]; then
  echo "🎉 All images are accessible!"
else
  echo "⚠️  Some images need to be replaced!"
fi
