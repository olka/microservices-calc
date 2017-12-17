




https://www.carlhopf.com/blog/2016/09/11/nodejs-cpu-profiling-production/
perf script | egrep -v "( __libc_start| LazyCompile | v8::internal::| Builtin:|v8::Function::Call | Stub:| LoadIC:|\[unknown\]| LoadPolymorphicIC:)" | sed 's/ LazyCompile:[*~]\?/ /' | ../FlameGraph/stackcollapse-perf.pl | ../FlameGraph/flamegraph.pl --color=js --hash  > node.svg
stackvis perf flamegraph-svg < out.nodestacks > collapsed.svg
./FlameGraph/stackcollapse-perf.pl < out.nodestacks
https://github.com/thlorenz/flamegraph


for dir in ./node-*; do (cd "$dir" && node --perf_basic_prof server.js  > /dev/null &); done


kubectl create -f https://raw.githubusercontent.com/kubernetes/dashboard/master/src/deploy/recommended/kubernetes-dashboard.yaml