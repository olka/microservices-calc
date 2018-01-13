

https://www.carlhopf.com/blog/2016/09/11/nodejs-cpu-profiling-production/
perf script | egrep -v "( __libc_start| LazyCompile | v8::internal::| Builtin:|v8::Function::Call | Stub:| LoadIC:|\[unknown\]| LoadPolymorphicIC:)" | sed 's/ LazyCompile:[*~]\?/ /' | ../FlameGraph/stackcollapse-perf.pl | ../FlameGraph/flamegraph.pl --color=js --hash  > node.svg
stackvis perf flamegraph-svg < out.nodestacks > collapsed.svg
./FlameGraph/stackcollapse-perf.pl < out.nodestacks
https://github.com/thlorenz/flamegraph


for dir in ./node-*; do (cd "$dir" && node --perf_basic_prof server.js  > /dev/null &); done



offcpu
sudo python offcpu -f -p 7932 > offcpu.stack
cat offcpu.stack | ../FlameGraph/flamegraph.pl --color=js --hash  > node.svg

https://poormansprofiler.org/

netutils/irqs
https://github.com/strizhechenko/netutils-linux


pv /dev/zero > /dev/null
tinkerboard
[2.54GiB/s]

tegra tk1
[5.17GiB/s]

mac pro i7
[16.0GiB/s]

 Pentium CPU G3460 @ 3.50GHz
[16.8GiB/s]

iperf -s
iperf -c 127.0.0.1

network mac -> pentium

tegra tk1
0.0-10.0 sec  11.4 GBytes  9.82 Gbits/sec
Pentium
0.0-10.0 sec  43.0 GBytes  36.9 Gbits/sec
mac pro
0.0-10.0 sec  48.2 GBytes  41.4 Gbits/sec

mac->tegra:  26.5 Mbits/sec