"""Create an offline interactive preview and a portable source archive after rendering."""
from pathlib import Path
import base64,html,json,stat,zipfile,subprocess
root=Path(__file__).resolve().parents[1]
video=root/'renders/mystery-button.mp4'
assert video.is_file(),'Run npm run render first'
proxy=root/'renders/mystery-button-preview.mp4'
if not proxy.exists() or proxy.stat().st_mtime<video.stat().st_mtime:
 subprocess.run(['ffmpeg','-y','-v','error','-i',str(video),'-vf','scale=540:960','-c:v','libx264','-preset','fast','-crf','25','-c:a','aac','-b:a','128k','-movflags','+faststart',str(proxy)],check=True)
data=base64.b64encode(proxy.read_bytes()).decode()
poster=base64.b64encode((root/'public/poster.jpg').read_bytes()).decode()
chapters=[(0,'The discovery'),(8,'The warning'),(18,'One little press'),(30,'Technical difficulties'),(42,'Missing Max'),(55,'A-peeling twist'),(65,'The wrong question')]
buttons=''.join(f'<button data-time="{start}"><small>{i+1:02d} / {start:02d}s</small>{html.escape(title)}</button>' for i,(start,title) in enumerate(chapters))
page='''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Bobo & Max — The Mystery Button</title><style>
*{box-sizing:border-box}body{margin:0;background:#0d1928;color:#e7f2ed;font:15px Arial,sans-serif}main{max-width:1100px;margin:auto;padding:36px 24px}header{display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #314555;padding-bottom:20px}header b{font-size:24px;letter-spacing:-1px}header span{font-size:10px;letter-spacing:2px;color:#9ebcc6}.layout{display:grid;grid-template-columns:minmax(230px,400px) 1fr;gap:50px;align-items:center;margin-top:30px}video{display:block;width:100%;max-height:82vh;aspect-ratio:9/16;border-radius:14px;background:#07111b;box-shadow:0 20px 80px #0005}h1{font-size:53px;line-height:.98;letter-spacing:-2px;margin:10px 0 20px}h1 span{color:#ff7b80}p{color:#a6bdc5;line-height:1.8;font-size:14px}.tag{font-size:10px;letter-spacing:3px;color:#f6cd7b}.chapters{display:grid;gap:7px;margin-top:25px}button{display:flex;align-items:center;gap:18px;text-align:left;color:#d4e8e7;background:#1c2e40;border:1px solid #365062;border-radius:6px;padding:12px;font-size:12px;cursor:pointer}button:hover,button:focus{background:#304d60}small{color:#91b4bd;font-size:9px;min-width:52px}.note{font-size:10px;color:#7e9fac;margin-top:24px}.clock{font-variant-numeric:tabular-nums;color:#f6cd7b;font-size:12px;margin-top:18px}@media(max-width:650px){.layout{grid-template-columns:1fr;gap:30px}video{max-height:80vh;margin:auto}h1{font-size:38px}header span{display:none}}
</style></head><body><main><header><b>bobo & max.</b><span>ORIGINAL MISADVENTURES / EPISODE 001</span></header><div class="layout"><video id="film" controls playsinline preload="metadata" poster="data:image/jpeg;base64,POSTER" src="data:video/mp4;base64,VIDEO"></video><section><div class="tag">75 SECONDS. ONE TERRIBLE IDEA.</div><h1>The Mystery<br/><span>Button.</span></h1><p>Max said no. Bobo heard “probably fine.”<br/>A tear in reality. A missing friend.<br/>A deeply inconvenient banana.</p><div class="chapters">BUTTONS</div><div class="clock" id="clock">00:00 / 01:15</div><p class="note">Original cartoon voices, music and sound design.<br/>540 × 960 offline preview. Full delivery: 1080 × 1920.<br/>Press play to enable sound.</p></section></div></main><script>
const film=document.getElementById('film');document.querySelectorAll('[data-time]').forEach(b=>b.addEventListener('click',()=>{film.currentTime=Number(b.dataset.time);film.play();}));film.addEventListener('timeupdate',()=>{const t=Math.floor(film.currentTime);document.getElementById('clock').textContent=String(Math.floor(t/60)).padStart(2,'0')+':'+String(t%60).padStart(2,'0')+' / 01:15';});
</script></body></html>'''.replace('POSTER',poster).replace('VIDEO',data).replace('BUTTONS',buttons)
(root/'renders/interactive-preview.html').write_text(page)
files=[root/name for name in ['.gitignore','README.md','index.html','package.json','package-lock.json','tsconfig.json','playwright.config.ts']]
for folder in ['src','scripts','tests','public']:
 files.extend(p for p in (root/folder).rglob('*') if p.is_file() and not p.is_symlink() and 'renders' not in p.relative_to(root).parts and not p.name.startswith('.unmastered'))
with zipfile.ZipFile(root/'renders/bobo-max-source.zip','w',zipfile.ZIP_DEFLATED,compresslevel=6) as z:
 for path in sorted(files):z.write(path,'bobo-max/'+str(path.relative_to(root)))
 link=zipfile.ZipInfo('bobo-max/public/renders');link.create_system=3;link.external_attr=(stat.S_IFLNK|0o777)<<16;z.writestr(link,'../renders')
for name in ['mystery-button.mp4','interactive-preview.html','bobo-max-source.zip']:
 p=root/'renders'/name;print(f'{name}: {p.stat().st_size:,} bytes')
