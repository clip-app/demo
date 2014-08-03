require 'cgi'

require 'rest_client'
require 'json'

puts 'Querying YouTube for results...'

response = RestClient.get 'https://www.kimonolabs.com/api/dmrfyik6?apikey=Iy57SYvswCvRczHIneDzQD2Xxo63hDfX'
arr = JSON.parse(response)

puts 'Found ' << arr.length << ' results, searching for transcriptions...'

vid_url = arr['results'].first[1].first['name']['href']
vid_id = vid_url.split("=").last

puts 'Grabbing transcriptions for video ID: ' << vid_id << '...'

transcription = RestClient.get 'http://video.google.com/timedtext', {:params => {'lang' => 'en', 'v' => vid_id}}

File.open('./transcription-' + vid_id + '.xml', 'w') do |file|
  file.write(transcription)
end

puts transcription
