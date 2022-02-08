rm -rf tmp_build
cnpm install
npm run build
mybuild_date=`date "+%m%d"`
mybuild_version=$(cat package.json | grep version | grep -v versions | awk -F: '{ print $2 }' | sed 's/[ ",]//g')
echo  $mybuild_version $mybuild_date
mkdir tmp_build
echo -e "version:$mybuild_version \ngit_sha1:$CI_COMMIT_SHA \ndate:$mybuild_date \n" >> version.txt
echo -e "version:$mybuild_version \ngit_sha1:$CI_COMMIT_SHA \ndate:$mybuild_date \n"
cp version.txt dist/
tar -zcv -f Portal-GUI-${mybuild_version}.tar.gz dist/
mv Portal-GUI-${mybuild_version}.tar.gz tmp_build/
mv version.txt tmp_build/
