"""Inspect the encoded delivery, not merely the React source or a zero-test build."""
from pathlib import Path
import subprocess,json,tempfile,wave,array,math
from PIL import Image,ImageChops,ImageStat
root=Path(__file__).resolve().parents[1]
video=root/'renders/Bobo_Max_Episode_001_Dont_Look_Behind_You.mp4'
def run(args):return subprocess.run(args,check=True,capture_output=True,text=True)
probe=json.loads(run(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(video)]).stdout)
v=next(s for s in probe['streams'] if s['codec_type']=='video');a=next(s for s in probe['streams'] if s['codec_type']=='audio')
assert (v['codec_name'],v['pix_fmt'],v['width'],v['height'],v['r_frame_rate'],int(v['nb_frames']))==('h264','yuv420p',1080,1920,'30/1',2250),v
assert a['codec_name']=='aac' and a['channels']==2,a
assert abs(float(probe['format']['duration'])-75)<.05
run(['ffmpeg','-v','error','-xerror','-i',str(video),'-f','null','-'])
# Check that the download is fast-start, without assuming atom byte offsets.
with video.open('rb') as f:
 atoms=[]
 while f.tell()<video.stat().st_size:
  at=f.tell();header=f.read(8)
  if len(header)<8:break
  size=int.from_bytes(header[:4],'big');kind=header[4:].decode('ascii','replace')
  if size==1:size=int.from_bytes(f.read(8),'big')
  atoms.append(kind)
  if size==0:break
  f.seek(at+size)
assert atoms.index('moov')<atoms.index('mdat'),atoms
r=json.loads((root/'public/pixel/audio/report.json').read_text())
with tempfile.TemporaryDirectory() as temp:
 wav=Path(temp)/'decoded.wav';run(['ffmpeg','-v','error','-i',str(video),'-vn','-ar','44100','-ac','1','-c:a','pcm_s16le',str(wav)])
 with wave.open(str(wav)) as w:rate=w.getframerate();samples=array.array('h',w.readframes(w.getnframes()))
 def rms(start,end):
  chunk=samples[round(start*rate):round(end*rate)];return math.sqrt(sum((x/32768)**2 for x in chunk)/max(1,len(chunk)))
 word_energy=[]
 for line in r['dialogue']:
  for word in line['words']:
   energy=rms(word['start']+.015,word['start']+(word['end']-word['start'])*.8)
   assert word['rms']>.01 and energy>.008,(line['text'],word['text'],energy)
   word_energy.append(energy)
 effect_energy=[]
 for e in r['effects']:
  energy=rms(e['at']+.008,e['at']+e['duration']*.8)
  assert e['rms']>.0005 and energy>.0002,(e['name'],e['at'],energy)
  effect_energy.append({'name':e['name'],'at':e['at'],'decodedRMS':energy})
 quiet=[rms(start+.15,end-.15) for start,end in r['silence']]
 assert all(q<.001 for q in quiet),quiet
 peak=max(abs(x) for x in samples)/32768;assert peak<.99,peak
out=root/'renders/pixel-qc';out.mkdir(exist_ok=True)
moments=json.loads((root/'public/pixel/stills/index.json').read_text());frames=[]
for m in moments+[{'name':'freeze-late','t':74.5}]:
 path=out/(m['name']+'.png');run(['ffmpeg','-y','-v','error','-ss',str(m['t']),'-i',str(video),'-frames:v','1','-vf','scale=360:640:flags=neighbor',str(path)])
 im=Image.open(path).convert('RGB');extrema=im.getextrema();assert max(z[1] for z in extrema)>60,('blank frame',m)
 ref=root/'public/pixel/stills'/(m['name']+'.png')
 error=None
 if ref.exists():
  error=sum(ImageStat.Stat(ImageChops.difference(im,Image.open(ref).convert('RGB'))).mean)/3
  assert error<12,('encoded frame differs from scene review',m,error)
 frames.append({**m,'meanRGBErrorVsReviewedFrame':error})
freeze_diff=sum(ImageStat.Stat(ImageChops.difference(Image.open(out/'freeze.png').crop((0,0,360,420)),Image.open(out/'freeze-late.png').crop((0,0,360,420)))).mean)/3
assert freeze_diff<1.5,('freeze pose moves',freeze_diff)
# An inspection sheet made from the actual encoded video.
sheet=Image.new('RGB',(1440,2680),'#101728')
from PIL import ImageDraw
draw=ImageDraw.Draw(sheet)
for i,m in enumerate(moments+[{'name':'freeze-late','t':74.5}]):
 x=i%4*360;y=i//4*670;sheet.paste(Image.open(out/(m['name']+'.png')),(x,y+25));draw.text((x+10,y+6),m['name'],fill='white')
sheet.save(root/'renders/pixel-encoded-contact-sheet.jpg',quality=92)
result={'file':video.name,'bytes':video.stat().st_size,'video':{k:v.get(k) for k in ['codec_name','profile','pix_fmt','color_range','color_space','width','height','r_frame_rate','nb_frames']},'audio':{k:a.get(k) for k in ['codec_name','profile','sample_rate','channels']},'duration':probe['format']['duration'],'fullDecode':'passed','fastStart':True,'dialoguePhrases':len(r['dialogue']),'audibleDialogueWords':len(word_energy),'minEncodedWordRMS':min(word_energy),'effects':effect_energy,'silenceRMS':quiet,'decodedMonoPeak':peak,'musicAfterRevealStemRMS':r['musicAfterCutRMS'],'frozenPictureMeanRGBDifference':freeze_diff,'representativeEncodedFrames':frames}
(root/'renders/pixel-validation.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result,indent=2))
