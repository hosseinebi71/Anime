"""Normalize the existing film for browser and Windows H.264/AAC playback; no animation changes."""
from pathlib import Path
import subprocess,json
root=Path(__file__).resolve().parents[1]
source=root/'renders/mystery-button.mp4'
output=root/'renders/mystery-button-compatible.mp4'
input_info=json.loads(subprocess.check_output(['ffprobe','-v','error','-select_streams','v:0','-show_entries','stream=pix_fmt,color_range','-of','json',str(source)],text=True))['streams'][0]
input_range='full' if input_info.get('color_range')=='pc' or input_info.get('pix_fmt','').startswith('yuvj') else 'limited'
subprocess.run(['ffmpeg','-y','-hide_banner','-loglevel','error','-i',str(source),'-map','0:v:0','-map','0:a:0','-vf',f'scale=in_range={input_range}:out_range=limited,format=yuv420p','-c:v','libx264','-preset','medium','-crf','22','-profile:v','main','-level:v','4.1','-pix_fmt','yuv420p','-color_range','tv','-colorspace','bt709','-color_primaries','bt709','-color_trc','bt709','-tag:v','avc1','-threads','3','-c:a','aac','-profile:a','aac_low','-b:a','160k','-ar','48000','-ac','2','-movflags','+faststart',str(output)],check=True)
info=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(output)],text=True))
v=next(s for s in info['streams'] if s['codec_type']=='video');a=next(s for s in info['streams'] if s['codec_type']=='audio')
assert v['codec_name']=='h264' and v['pix_fmt']=='yuv420p' and v['codec_tag_string']=='avc1'
assert a['codec_name']=='aac' and a['profile']=='LC'
# Verify that moov precedes mdat, so metadata is available before the movie has downloaded.
with output.open('rb') as f:
 atoms=[]
 while f.tell()<output.stat().st_size:
  at=f.tell();header=f.read(8)
  if len(header)<8:break
  size=int.from_bytes(header[:4],'big');tag=header[4:].decode('ascii','replace')
  if size==1:size=int.from_bytes(f.read(8),'big')
  atoms.append(tag)
  if size==0:break
  f.seek(at+size)
assert atoms.index('moov')<atoms.index('mdat'),atoms
subprocess.run(['ffmpeg','-v','error','-xerror','-i',str(output),'-f','null','-'],check=True)
report={'file':output.name,'bytes':output.stat().st_size,'duration':info['format']['duration'],'video':{k:v[k] for k in ['codec_name','profile','level','pix_fmt','color_range','width','height','r_frame_rate','nb_frames']},'audio':{k:a[k] for k in ['codec_name','profile','sample_rate','channels']},'fastStart':True,'fullDecode':'passed'}
(root/'renders/playback-verification.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps(report,indent=2))
