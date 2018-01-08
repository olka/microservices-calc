https://www.carlhopf.com/blog/2016/09/11/nodejs-cpu-profiling-production/
perf script | egrep -v "( __libc_start| LazyCompile | v8::internal::| Builtin:|v8::Function::Call | Stub:| LoadIC:|\[unknown\]| LoadPolymorphicIC:)" | sed 's/ LazyCompile:[*~]\?/ /' | ../FlameGraph/stackcollapse-perf.pl | ../FlameGraph/flamegraph.pl --color=js --hash  > node.svg
stackvis perf flamegraph-svg < out.nodestacks > collapsed.svg
./FlameGraph/stackcollapse-perf.pl < out.nodestacks
https://github.com/thlorenz/flamegraph


for dir in ./node-*; do (cd "$dir" && node --perf_basic_prof server.js  > /dev/null &); done



offcpu
sudo python offcpu -f -p 7932 > offcpu.stack
cat offcpu.stack | ../FlameGraph/flamegraph.pl --color=js --hash  > node.svg


netutils/irqs
https://github.com/strizhechenko/netutils-linux


pv /dev/zero > /dev/null
tinkerboard
[2.54GiB/s]

mac pro
[16.0GiB/s]