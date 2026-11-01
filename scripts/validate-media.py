"""Validate delivered video, decoded audio, dialogue energy and intentional dramatic silence."""
import json, subprocess, tempfile, wave, array, math
from pathlib import Path
root=Path(__file__).resolve().parents[1]
video=root/'renders/mystery-button.mp4'
def run(args): return subprocess.run(args,check=True,capture_output=True,text=True)
probe=json.loads(run(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(video)]).stdout)
v=next(s for s in probe['streams'] if s['codec_type']=='video')
a=next(s for s in probe['streams'] if s['codec_type']=='audio')
assert (v['codec_name'],v['width'],v['height'],v['r_frame_rate'],int(v['nb_frames']))==('h264',1080,1920,'30/1',2250),v
assert a['codec_name']=='aac' and a['channels']==2,a
assert abs(float(probe['format']['duration'])-75)<.05,probe['format']
run(['ffmpeg','-v','error','-xerror','-i',str(video),'-f','null','-'])
report=json.loads((root/'public/audio/report.json').read_text())
with tempfile.TemporaryDirectory() as temp:
 decoded=Path(temp)/'decoded.wav'
 run(['ffmpeg','-v','error','-i',str(video),'-vn','-ar','44100','-ac','1','-c:a','pcm_s16le',str(decoded)])
 with wave.open(str(decoded)) as w:
  rate=w.getframerate();samples=array.array('h',w.readframes(w.getnframes()))
 def rms(start,end):
  data=samples[round(start*rate):round(end*rate)]
  return math.sqrt(sum((s/32768)**2 for s in data)/max(1,len(data)))
 checked=0
 for line in report['dialogue']:
  for word in line['words']:
   energy=rms(word['start']+.03,word['start']+(word['end']-word['start'])*.75)
   assert energy>.008,(line['text'],word['text'],'silent rendered word',energy)
   assert word['rms']>.01,('silent synthesized voice',word)
   checked+=1
 silences=[rms(start+.15,end-.15) for start,end in report['silence']]
 assert all(s<.001 for s in silences),('dramatic silence missing',silences)
 peak=max(abs(s) for s in samples)/32768
 assert peak<.99,('decoded audio clipping',peak)
 result={'video':'1080x1920 H.264, 30 fps, 2250 decoded frames','duration':75,'audio':'stereo AAC','dialogueLines':len(report['dialogue']),'audibleWords':checked,'decodedMonoPeak':peak,'dramaticSilenceRMS':silences,'fullDecode':'passed'}
 (root/'renders/validation.json').write_text(json.dumps(result,indent=2)+'\n')
 print(json.dumps(result,indent=2))
