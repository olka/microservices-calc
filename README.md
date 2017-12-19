


export POSTFIX_URL=127.0.0.1
export ADD_URL=127.0.0.1
export SUB_URL=127.0.0.1
export MUL_URL=127.0.0.1
export DIVIDE_URL=127.0.0.1
export POWER_URL=127.0.0.1

https://www.carlhopf.com/blog/2016/09/11/nodejs-cpu-profiling-production/
perf script | egrep -v "( __libc_start| LazyCompile | v8::internal::| Builtin:|v8::Function::Call | Stub:| LoadIC:|\[unknown\]| LoadPolymorphicIC:)" | sed 's/ LazyCompile:[*~]\?/ /' | ../FlameGraph/stackcollapse-perf.pl | ../FlameGraph/flamegraph.pl --color=js --hash  > node.svg
stackvis perf flamegraph-svg < out.nodestacks > collapsed.svg
./FlameGraph/stackcollapse-perf.pl < out.nodestacks
https://github.com/thlorenz/flamegraph


for dir in ./node-*; do (cd "$dir" && node --perf_basic_prof server.js  > /dev/null &); done


kubectl create -f https://raw.githubusercontent.com/kubernetes/dashboard/master/src/deploy/recommended/kubernetes-dashboard.yaml



offcpu
sudo python offcpu -f -p 7932 > offcpu.stack
cat offcpu.stack | ../FlameGraph/flamegraph.pl --color=js --hash  > node.svg
